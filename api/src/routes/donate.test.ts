import type { Prisma } from '@prisma/client';
import {
  createSuperRequest,
  devLogin,
  setupServer,
  superRequest,
  defaultUserEmail
} from '../../jest.utils';
import { createUserInput } from '../utils/create-user';

const testEWalletEmail = 'baz@bar.com';
const testSubscriptionId = 'sub_test_id';
const testCustomerId = 'cust_test_id';
const userWithoutProgress: Prisma.userCreateInput =
  createUserInput(defaultUserEmail);
const userWithProgress: Prisma.userCreateInput = {
  ...createUserInput(defaultUserEmail),
  completedChallenges: [
    {
      id: 'a6b0bb188d873cb2c8729495',
      completedDate: 1520002973119,
      solution: null,
      challengeType: 5
    },
    {
      id: '33b0bb188d873cb2c8729433',
      completedDate: 4420002973122,
      solution: null,
      challengeType: 5
    },
    {
      id: 'a5229172f011153519423690',
      completedDate: 1520440323273,
      solution: null,
      challengeType: 5
    },
    {
      id: 'a5229172f011153519423692',
      completedDate: 1520440323274,
      githubLink: '',
      challengeType: 5
    }
  ]
};
const sharedDonationReqBody = {
  amount: 500,
  duration: 'month'
};
const chargeStripeReqBody = {
  email: testEWalletEmail,
  subscriptionId: 'sub_test_id',
  ...sharedDonationReqBody
};
const chargeStripeCardReqBody = {
  paymentMethodId: 'UID',
  ...sharedDonationReqBody
};
const createStripePaymentIntentReqBody = {
  email: testEWalletEmail,
  name: 'Baz Bar',
  token: { id: 'tok_123' },
  ...sharedDonationReqBody
};
const mockSubCreate = jest.fn();
const mockAttachPaymentMethod = jest.fn(() =>
  Promise.resolve({
    id: 'pm_1MqLiJLkdIwHu7ixUEgbFdYF',
    object: 'payment_method'
  })
);
const mockCustomerCreate = jest.fn(() =>
  Promise.resolve({
    id: testCustomerId,
    name: 'Jest_User',
    currency: 'sgd',
    description: 'Jest User Account created'
  })
);
const mockSubRetrieveObj = {
  id: testSubscriptionId,
  items: {
    data: [
      {
        plan: {
          product: 'prod_GD1GGbJsqQaupl'
        }
      }
    ]
  },
  // 1 Jan 2040
  current_period_start: Math.floor(Date.now() / 1000),
  customer: testCustomerId,
  status: 'active'
};
const mockSubRetrieve = jest.fn(() => Promise.resolve(mockSubRetrieveObj));
const mockCustomerUpdate = jest.fn();
const generateMockSubCreate = (status: string) => () =>
  Promise.resolve({
    id: testSubscriptionId,
    latest_invoice: {
      payment_intent: {
        client_secret: 'superSecret',
        status
      }
    }
  });
const defaultError = () =>
  Promise.reject(new Error('Stripe encountered an error'));

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      customers: {
        create: mockCustomerCreate,
        update: mockCustomerUpdate
      },
      paymentMethods: {
        attach: mockAttachPaymentMethod
      },
      subscriptions: {
        create: mockSubCreate,
        retrieve: mockSubRetrieve
      }
    };
  });
});

describe('Donate', () => {
  setupServer();
  describe('Authenticated User', () => {
    let superPost: ReturnType<typeof createSuperRequest>;
    const verifyUpdatedUserAndNewDonation = async (email: string) => {
      const user = await fastifyTestInstance.prisma.user.findFirst({
        where: { email }
      });
      const donations = await fastifyTestInstance.prisma.donation.findMany({
        where: { userId: user?.id }
      });
      const donation = donations[0];
      expect(donations.length).toBe(1);
      expect(donation?.amount).toBe(sharedDonationReqBody.amount);
      expect(donation?.duration).toBe(sharedDonationReqBody.duration);
      expect(typeof donation?.subscriptionId).toBe('string');
      expect(donation?.customerId).toBe(testCustomerId);
      expect(donation?.provider).toBe('stripe');
    };
    const verifyNoUpdatedUserAndNoNewDonation = async (email: string) => {
      const user = await fastifyTestInstance.prisma.user.findFirst({
        where: { email }
      });
      const donations = await fastifyTestInstance.prisma.donation.findMany({});
      expect(user?.isDonating).toBe(false);
      expect(donations.length).toBe(0);
    };
    const verifyNoNewUserAndNoNewDonation = async () => {
      const user = await fastifyTestInstance.prisma.user.findFirst({
        where: { email: testEWalletEmail }
      });
      const donations = await fastifyTestInstance.prisma.donation.findMany({});
      expect(user).toBe(null);
      expect(donations.length).toBe(0);
    };

    beforeEach(async () => {
      const setCookies = await devLogin();
      superPost = createSuperRequest({ method: 'POST', setCookies });
      await fastifyTestInstance.prisma.user.updateMany({
        where: { email: userWithProgress.email },
        data: userWithProgress
      });
      await fastifyTestInstance.prisma.user.deleteMany({
        where: { email: testEWalletEmail }
      });
      await fastifyTestInstance.prisma.donation.deleteMany({});
    });

    describe('POST /donate/charge-stripe-card', () => {
      it('should return 200 and update the user', async () => {
        mockSubCreate.mockImplementationOnce(
          generateMockSubCreate('we only care about specific error cases')
        );
        const response = await superPost('/donate/charge-stripe-card').send(
          chargeStripeCardReqBody
        );
        await verifyUpdatedUserAndNewDonation(userWithProgress.email);
        expect(response.body).toEqual({ isDonating: true, type: 'success' });
        expect(response.status).toBe(200);
      });

      it('should return 402 with client_secret if subscription status requires source action', async () => {
        mockSubCreate.mockImplementationOnce(
          generateMockSubCreate('requires_source_action')
        );
        const response = await superPost('/donate/charge-stripe-card').send(
          chargeStripeCardReqBody
        );
        await verifyNoUpdatedUserAndNoNewDonation(userWithProgress.email);
        expect(response.body).toEqual({
          error: {
            type: 'UserActionRequired',
            message: 'Payment requires user action',
            client_secret: 'superSecret'
          }
        });
        expect(response.status).toBe(402);
      });

      it('should return 402 if subscription status requires source', async () => {
        mockSubCreate.mockImplementationOnce(
          generateMockSubCreate('requires_source')
        );
        const response = await superPost('/donate/charge-stripe-card').send(
          chargeStripeCardReqBody
        );
        await verifyNoUpdatedUserAndNoNewDonation(userWithProgress.email);
        expect(response.body).toEqual({
          error: {
            type: 'PaymentMethodRequired',
            message: 'Card has been declined'
          }
        });
        expect(response.status).toBe(402);
      });

      it('should return 400 if the user is already donating', async () => {
        mockSubCreate.mockImplementationOnce(
          generateMockSubCreate('still does not matter')
        );
        const successResponse = await superPost(
          '/donate/charge-stripe-card'
        ).send(chargeStripeCardReqBody);
        const failResponse = await superPost('/donate/charge-stripe-card').send(
          chargeStripeCardReqBody
        );

        //Verify that only the first call changed the DB
        await verifyUpdatedUserAndNewDonation(userWithProgress.email);
        expect(successResponse.status).toBe(200);
        expect(failResponse.body).toEqual({
          error: {
            type: 'AlreadyDonatingError',
            message: 'User is already donating.'
          }
        });
        expect(failResponse.status).toBe(400);
      });

      it('should return 500 if Stripe encountes an error', async () => {
        mockSubCreate.mockImplementationOnce(defaultError);
        const response = await superPost('/donate/charge-stripe-card').send(
          chargeStripeCardReqBody
        );
        await verifyNoUpdatedUserAndNoNewDonation(userWithProgress.email);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
          error: 'Donation failed due to a server error.'
        });
      });

      it('should return 400 if user has not completed challenges', async () => {
        await fastifyTestInstance.prisma.user.updateMany({
          where: { email: userWithProgress.email },
          data: userWithoutProgress
        });
        const failResponse = await superPost('/donate/charge-stripe-card').send(
          chargeStripeCardReqBody
        );
        await verifyNoUpdatedUserAndNoNewDonation(userWithProgress.email);
        expect(failResponse.body).toEqual({
          error: {
            type: 'MethodRestrictionError',
            message: `Donate using another method`
          }
        });
        expect(failResponse.status).toBe(400);
      });
    });

    describe('POST /donate/add-donation', () => {
      it('should return 200 and update the user', async () => {
        const response = await superPost('/donate/add-donation').send({
          anything: true,
          itIs: 'ignored'
        });
        const user = await fastifyTestInstance.prisma.user.findFirst({
          where: { email: userWithProgress.email }
        });
        expect(user?.isDonating).toBe(true);
        expect(response.body).toEqual({
          isDonating: true
        });
        expect(response.status).toBe(200);
      });

      it('should return 400 if the user is already donating', async () => {
        const successResponse = await superPost('/donate/add-donation').send(
          {}
        );
        expect(successResponse.status).toBe(200);
        const failResponse = await superPost('/donate/add-donation').send({});
        expect(failResponse.status).toBe(400);
      });
    });

    describe('POST /donate/create-stripe-payment-intent', () => {
      it('should return 200 and call stripe api properly', async () => {
        mockSubCreate.mockImplementationOnce(
          generateMockSubCreate('no-errors')
        );
        const response = await superPost(
          '/donate/create-stripe-payment-intent'
        ).send(createStripePaymentIntentReqBody);
        expect(mockCustomerCreate).toHaveBeenCalledWith({
          email: testEWalletEmail,
          name: 'Baz Bar'
        });
        expect(response.status).toBe(200);
      });

      it('should return 400 when email format is wrong', async () => {
        const response = await superPost(
          '/donate/create-stripe-payment-intent'
        ).send({
          ...createStripePaymentIntentReqBody,
          email: '12raqdcev'
        });
        expect(response.body).toEqual({
          error: 'The donation form had invalid values for this submission.'
        });
        expect(response.status).toBe(400);
      });

      it('should return 400 if amount is incorrect', async () => {
        const response = await superPost(
          '/donate/create-stripe-payment-intent'
        ).send({
          ...createStripePaymentIntentReqBody,
          amount: '350'
        });
        expect(response.body).toEqual({
          error: 'The donation form had invalid values for this submission.'
        });
        expect(response.status).toBe(400);
      });

      it('should return 500 if Stripe encounters an error', async () => {
        mockSubCreate.mockImplementationOnce(defaultError);
        const response = await superPost(
          '/donate/create-stripe-payment-intent'
        ).send(createStripePaymentIntentReqBody);
        expect(response.body).toEqual({
          error: 'Donation failed due to a server error.'
        });
        expect(response.status).toBe(500);
      });
    });

    describe('POST /donate/charge-stripe', () => {
      it('should return 200 and call stripe api properly', async () => {
        mockSubCreate.mockImplementationOnce(
          generateMockSubCreate('no-errors')
        );
        const response = await superPost('/donate/charge-stripe').send(
          chargeStripeReqBody
        );
        await verifyUpdatedUserAndNewDonation(testEWalletEmail);
        expect(mockSubRetrieve).toHaveBeenCalledWith('sub_test_id');
        expect(response.status).toBe(200);
      });

      it('should return 500 when if product id is wrong', async () => {
        mockSubRetrieve.mockImplementationOnce(() =>
          Promise.resolve({
            ...mockSubRetrieveObj,
            items: {
              ...mockSubRetrieveObj.items,
              data: [
                {
                  ...mockSubRetrieveObj.items.data[0],
                  plan: {
                    product: 'wrong_product_id'
                  }
                }
              ]
            }
          })
        );
        const response = await superPost('/donate/charge-stripe').send(
          chargeStripeReqBody
        );
        await verifyNoNewUserAndNoNewDonation();
        expect(response.body).toEqual({
          error: 'Donation failed due to a server error.'
        });
        expect(response.status).toBe(500);
      });

      it('should return 500 if subsciption is not active', async () => {
        mockSubRetrieve.mockImplementationOnce(() =>
          Promise.resolve({
            ...mockSubRetrieveObj,
            status: 'canceled'
          })
        );
        const response = await superPost('/donate/charge-stripe').send(
          chargeStripeReqBody
        );
        await verifyNoNewUserAndNoNewDonation();
        expect(response.body).toEqual({
          error: 'Donation failed due to a server error.'
        });
        expect(response.status).toBe(500);
      });

      it('should return 500 if timestamp is old', async () => {
        mockSubRetrieve.mockImplementationOnce(() =>
          Promise.resolve({
            ...mockSubRetrieveObj,
            current_period_start: Math.floor(Date.now() / 1000) - 500
          })
        );
        const response = await superPost('/donate/charge-stripe').send(
          chargeStripeReqBody
        );
        await verifyNoNewUserAndNoNewDonation();
        expect(response.body).toEqual({
          error: 'Donation failed due to a server error.'
        });
        expect(response.status).toBe(500);
      });
    });
  });

  describe('Unauthenticated User', () => {
    let setCookies: string[];
    // Get the CSRF cookies from an unprotected route
    beforeAll(async () => {
      const res = await superRequest('/status/ping', { method: 'GET' });
      setCookies = res.get('Set-Cookie');
    });

    const endpoints: { path: string; method: 'POST' }[] = [
      { path: '/donate/add-donation', method: 'POST' },
      { path: '/donate/charge-stripe-card', method: 'POST' }
    ];

    endpoints.forEach(({ path, method }) => {
      test(`${method} ${path} returns 401 status code with error message`, async () => {
        const response = await superRequest(path, {
          method,
          setCookies
        });
        expect(response.statusCode).toBe(401);
      });
    });

    test('POST /donate/create-stripe-payment-intent should return 200', async () => {
      mockSubCreate.mockImplementationOnce(generateMockSubCreate('no-errors'));
      const response = await superRequest(
        '/donate/create-stripe-payment-intent',
        {
          method: 'POST',
          setCookies
        }
      ).send(createStripePaymentIntentReqBody);
      expect(response.status).toBe(200);
    });

    test('POST /donate/charge-stripe should return 200', async () => {
      mockSubCreate.mockImplementationOnce(generateMockSubCreate('no-errors'));
      const response = await superRequest('/donate/charge-stripe', {
        method: 'POST',
        setCookies
      }).send(chargeStripeReqBody);
      expect(response.status).toBe(200);
    });
  });
});

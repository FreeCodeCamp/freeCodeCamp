const Joi = require('joi');
const findIndex = require('lodash/findIndex');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.objectId();
const duplicatedProjectIds = [
  // I tried to keep these in the order of the new front end certification.

  /*** HTML ***/

  // Cat Photo App

  // Survey Form
  '587d78af367417b2b2512b03',

  /*** CSS ***/

  // Cafe Menu
  '5f33071498eb2472b87ddee4',
  '5f3313e74582ad9d063e3a38',
  '5f331e55dfab7a896e53c3a1',
  '5f3326b143638ee1a09ff1e3',
  '5f33294a6af5e9188dbdb8f3',
  '5f332a88dc25a0fd25c7687a',
  '5f332b23c2045fb843337579',
  '5f344fc1520b6719f2e35605',
  '5f344fbc22624a2976425065',
  '5f344fad8bf01691e71a30eb',
  '5f344f9c805cd193c33d829c',
  '5f3477ae9675db8bb7655b30',
  '5f3477ae34c1239cafe128be',
  '5f3477aefa51bfc29327200b',
  '5f3477ae8466a9a3d2cc953c',
  '5f3477cb2e27333b1ab2b955',
  '5f3477cbcb6ba47918c1da92',
  '5f3477cb303c5cb61b43aa9b',
  '5f34a1fd611d003edeafd681',
  '5f356ed6cf6eab5f15f5cfe6',
  '5f356ed63c7807a4f1e6d054',
  '5f356ed60a5decd94ab66986',
  '5f356ed63e0fa262326eef05',
  '5f356ed60785e1f3e9850b6e',
  '5f356ed656a336993abd9f7c',
  '5f356ed6199b0cdef1d2be8f',
  '5f356ed69db0a491745e2bb6',
  '5f35e5c44359872a137bd98f',
  '5f35e5c4321f818cdc4bed30',
  '5f3c866daec9a49519871816',
  '5f3c866d5414453fc2d7b480',
  '5f3c866d28d7ad0de6470505',
  '5f769541be494f25449b292f',
  '5f76967fad478126d6552b0d',
  '5f769702e6e33127d14aa120',
  '5f3c866de7a5b784048f94b1',
  '5f3c866dbf362f99b9a0c6d0',
  '5f3c866d0fc037f7311b4ac8',
  '5f3c866dd0d0275f01d4d847',
  '5f3cade9fa77275d9f4efe62',
  '5f3cade94c6576e7f7b7953f',
  '5f3cade9993019e26313fa8e',
  '5f7691dafd882520797cd2f0',
  '5f7692f7c5b3ce22a57788b6',
  '5f47633757ae3469f2d33d2e',
  '5f3cade99dda4e6071a85dfd',
  '5f3ef6e0e0c3feaebcf647ad',
  '5f3ef6e0819d4f23ca7285e6',
  '5f716ad029ee4053c7027a7a',
  '5f7b87422a560036fd03ccff',
  '5f7b88d37b1f98386f04edc0',
  '5f716bee5838c354c728a7c5',
  '5f3ef6e0eaa7da26e3d34d78',
  '5f3ef6e050279c7a4a7101d3',
  '5f3ef6e04559b939080db057',
  '5f3ef6e03d719d5ac4738993',
  '5f3ef6e05473f91f948724ab',
  '5f3ef6e056bdde6ae6892ba2',
  '5f3ef6e0e9629bad967cd71e',
  '5f3ef6e06d34faac0447fc44',
  '5f3ef6e087d56ed3ffdc36be',
  '5f3ef6e0f8c230bdd2349716',
  '5f3ef6e07276f782bb46b93d',
  '5f3ef6e0a81099d9a697b550',
  '5f3ef6e0b431cc215bb16f55',
  '5f3ef6e01f288a026d709587',
  '5f3f26fa39591db45e5cd7a0',
  '5f459225127805351a6ad057',
  '5f459a7ceb8b5c446656d88b',
  '5f459cf202c2a3472fae6a9f',
  '5f459fd48bdc98491ca6d1a3',
  '5f45a05977e2fa49d9119437',
  '5f45a276c093334f0f6e9df4',
  '5f45a5a7c49a8251f0bdb527',
  '5f46fc57528aa1c4b5ea7c2e',
  '5f4701b942c824109626c3d8',
  '5f46ede1ff8fec5ba656b44c',
  '5f45a66d4a2b0453301e5a26',
  '5f45b0731d39e15d54df4dfc',
  '5f45b25e7ec2405f166b9de1',
  '5f45b3c93c027860d9298dbd',
  '5f45b45d099f3e621fbbb256',
  '5f45b4c81cea7763550e40df',
  '5f45b715301bbf667badc04a',
  '5f46e270702a8456a664f0df',
  '5f46e36e745ead58487aabf2',
  '5f46e7a4750dd05b5a673920',
  '5f46e8284aae155c83015dee',
  '5f475bb508746c16c9431d42',
  '5f475e1c7f71a61d913836c6',
  '5f47fe7e31980053a8d4403b',
  // Colored Markers

  // Registration Form

  // Rothko Painting
  '60a3e3396c7b40068ad6996b',
  '60a3e3396c7b40068ad6996c',
  '60a3e3396c7b40068ad6996d',
  '60a3e3396c7b40068ad6996e',
  '60a3e3396c7b40068ad6996f',
  '60a3e3396c7b40068ad69970',
  '60a3e3396c7b40068ad69971',
  '60a3e3396c7b40068ad69972',
  '60a3e3396c7b40068ad69973',
  '60a3e3396c7b40068ad69974',
  '60a3e3396c7b40068ad69975',
  '60a3e3396c7b40068ad69976',
  '60a3e3396c7b40068ad69977',
  '60a3e3396c7b40068ad69978',
  '60a3e3396c7b40068ad69979',
  '60a3e3396c7b40068ad6997a',
  '60a3e3396c7b40068ad6997b',
  '60a3e3396c7b40068ad6997c',
  '60a3e3396c7b40068ad6997d',
  '60a3e3396c7b40068ad6997e',
  '60a3e3396c7b40068ad6997f',
  '60a3e3396c7b40068ad69980',
  '60a3e3396c7b40068ad69981',
  '60a3e3396c7b40068ad69982',
  '60a3e3396c7b40068ad69983',
  '60a3e3396c7b40068ad69984',
  '60a3e3396c7b40068ad69986',
  '60a3e3396c7b40068ad69987',
  '60a3e3396c7b40068ad69988',
  '60a3e3396c7b40068ad69989',
  '60a3e3396c7b40068ad6998a',
  '60a3e3396c7b40068ad6998b',
  '60a3e3396c7b40068ad6998c',
  '60a3e3396c7b40068ad6998d',
  '60a3e3396c7b40068ad6998e',
  '60a3e3396c7b40068ad6998f',
  '60a3e3396c7b40068ad69990',
  '60a3e3396c7b40068ad69991',
  '60a3e3396c7b40068ad69992',
  '60a3e3396c7b40068ad69993',
  '60a3e3396c7b40068ad69994',
  '60a3e3396c7b40068ad69995',
  '60a3e3396c7b40068ad69996',
  '60a3e3396c7b40068ad69997',

  // Flexbox Photo Gallery
  '61537bb9b1a29430ac15ad38',
  '61537c5f81f0cf325b4a854c',
  '61537c9eecea6a335db6da79',
  '61537d86bdc3dd343688fceb',
  '64dd076a1b33c86d84b4232f',
  '6494da0daf5df5197963671d',
  '6493bc0d99879635209565aa',
  '64dd136e4e8b0894f9c70d86',
  '615380dff67172357fcf0425',
  '615f171d05def3218035dc85',
  '6153893900438b4643590367',
  '6153897c27f6334716ee5abe',
  '6153908a366afb4d57185c8d',
  '615392916d83fa4f02f7e2cf',
  '6153938dce8b294ff8f5a4e9',
  '6153947986535e5117e60615',
  '61539e07e7430b528fbffe21',
  '61539f32a206bd53ec116465',
  '6153a04847abee57a3a406ac',
  '6153a3485f0b20591d26d2a1',
  '6153a3952facd25a83fe8083',
  '6153a3ebb4f7f05b8401b716',

  // Nutrition Label
  '615f2abbe7d18d49a1e0e1c8',
  '615f2d4150fe0d4cbd0f2628',
  '615f34948891834dd77655a6',
  '615f34ecc1091b4fd5a8a484',
  '615f357957e370510f21ea16',
  '615f378014c2da526a109c81',
  '615f38279e5c3d53692ea441',
  '615f38cabc64e3556f98cc1a',
  '615f3949f58e12577dcefb00',
  '615f39d7da41b15851fa3fb9',
  '615f3b091162165948e1cb33',
  '615f3cafd794015aa9547a6d',
  '615f3d9e59db4b5b8e960762',
  '615f3e1b7233ee5c7595771f',
  '615f3e4af8008c5d494d3afe',
  '615f3ed16592445e57941aec',
  '615f405b89a7ec5f8e2d11f4',
  '615f40b01f680e608d360ed4',
  '615f4172e9eec061d6456221',
  '615f41c979787462e76dab90',
  '615f423cf65d5864132a0956',
  '615f42a021625f656101ef93',
  '615f4bfb9de4a16703b56eb6',
  '615f4ce9d877b668417c0c42',
  '615f4dde9d72e3694cb9ee3b',
  '615f4ec58334106a4170c2a8',
  '615f4f9e4a40566b776a8f38',
  '615f50473cc0196c6dd3892a',
  '615f51257a8a516d80b6c743',
  '615f51e4e5b24a6e80eccce1',
  '615f522dea4f776f64dc3e91',
  '6395d33ab5d91bf317107c48',
  '615f5486b8fd4b71633f69b0',
  '6396e33fe478dd264ebbf278',
  '615f575b50b91e72af079480',
  '615f5af373a68e744a3c5a76',
  '615f5fd85d0062761f288364',
  '615f61338c8ca176d6445574',
  '615f666ac5edea782feb7e75',
  '615f671b6d1919792745aa5d',
  '635bde33c91c80540eae239b',
  '615f6823d0815b7a991f2a75',
  '615f6b2d164f81809efd9bdc',
  '667d1bb875f5961913176069',
  '615f6cc778f7698258467596',
  '615f6fddaac1e083502d3e6a',
  '615f70077a4ff98424236c1e',
  '615f72a872354a850d4f533e',
  '615f74a71f1e498619e38ee8',
  '615f7ad94380408d971d14f6',
  '615f7bc680f7168ea01ebf99',
  '615f7c71eab8218f846e4503',
  '615f7d489a581590d1350288',
  '615f7de4487b64919bb4aa5e',
  '615f7e7281626a92bbd62da8',
  '615f7ecb09de9a938ef94756',
  '615f7fa959ab75948f96a0d6',
  '615f808d85793195b0f53be9',
  '615f829d07b18f96f6f6684b',
  '615f83ef928ec9982b785b6a',
  '615f84f246e8ba98e3cd97be',
  '615f887466db4ba14b5342cc',
  '615f89e055040ba294719d2f',
  '615f8bfe0f30a1a3c340356b',
  '615f8f1223601fa546e93f31',
  '615f905fbd1017a65ca224eb',
  '615f94786869e1a7fec54375',
  '615f951dff9317a900ef683f',
  // Accessibility Quiz

  // Tribute Page
  'bd7158d8c442eddfaeb5bd18',

  // Balance Sheet
  '61fd5a93fd62bb35968adeab',
  '61fd6343fb42013d99bcd7f3',
  '61fd66c687e610436494c6f1',
  '61fd67a656743144844941cb',
  '61fd6ab779390f49148773bb',
  '61fd6b7c83dbf54a08cf0498',
  '61fd6cc9475a784b7776233e',
  '61fd70336ebb3e4f62ee81ba',
  '61fd719788899952e67692b9',
  '61fd71d596e8f253b9408b39',
  '61fd75ea7f663457612dba02',
  '61fd7648a7ba2e5882436831',
  '61fd778081276b59d59abad6',
  '61fd77f7ad2aeb5ae34d07d6',
  '61fd78621573aa5e8b512f5e',
  '61fd7a160ed17960e971f28b',
  '61fd7b3fcaa5406257abc5d1',
  '61fd8e491324ce717da97ffe',
  '61fd8fd08af43372f02952d0',
  '61fd9126aa72a474301fc49f',
  '61fd933ba685de776a94997e',
  '61fd94056e0355785fbba4d3',
  '61fd986ddbcbd47ba8fbc5ec',
  '61fd990577d8227dd93fbeeb',
  '61fd9a4ff2fc4481b9157bd7',
  '61fd9ad665a4a282c8106be3',
  '61fd9b7285bde783ad5b8aac',
  '61fd9d9fbdfe078800317055',
  '61fda307bde0b091cf7d884a',
  '61fda339eadcfd92a6812bed',
  '61fdac1e31692f9a9ad97295',
  '61fdaea3999cb19d76ce717b',
  '61fdaf9ff894b6a084ecdc1b',
  '61fdafe6f07fd7a1c6785bc2',
  '61fdb04d9939f0a26ca51c2b',
  '620159cd5431aa34bc6a4c9c',
  '62015a5da1c95c358f079ebb',
  '62015cd2654a1139321a89d2',
  '62015d8942384c3aed48329e',
  '620167374bb8b4455cd11125',
  '620174ed519dd7506c1a4b61',
  '620175b3710a0951cfa86edf',
  '64076bbeba941114b0027b6a',
  '6201782cc420715562f36271',
  '620179bc0a6a2358c72b90ad',
  '62017b6f47454059bf2d3bd1',
  '62017f47c87be96457c49f46',
  '62017fa5bbef406580ceb44f',
  '62018243f046a368fab8ffb6',
  '6201830cb0c74b69f1b41635',
  '620186f4b6b8356d2def576b',
  '62018ba1aa263770c953be66',
  '62018c3e94434a71af1d5eaa',
  '62018ec29b3ae674f40bef31',
  '62019093fe30e278e797d2f6',
  '620191707bc65579ddd3ce15',
  '620192a767533a7ad19d96d7',
  '6201995d9ab88e80f1989dce',
  '620199c7a7a32c81d4db3410',
  '6201a1a7af32c287bd6b8183',
  '6201a1cc668a34888f5b2f52',
  '6201a20d742f5c89736c8cfb',
  '6201a42e39bf3b95b6a33bf3',
  '6201a4adcc6414968b391592',
  '6201a5258af7b398b030bfaf',
  '6201a59be346d399c21d10b1',
  // Cat Painting

  // Responsive Piano
  '612e78af05201622d4bab8aa',
  '612e7d1c29fb872d6384379c',
  '612e804c54d5e7308d7ebe56',
  '612e813b3ba67633222cbe54',
  '612e8279827a28352ce83a72',
  '612e83ec2eca1e370f830511',
  '612e89562043183c86df287c',
  '612e89d254fe5d3df7d6693d',
  '612e8eebe3a6dc3fcc33a66f',
  '612e95ef2e4bdf41f69067f9',
  '612e96fc87fe8e44f69f7ec5',
  '612e98f3245c98475e49cfc6',
  '612e9a21381a1949327512e6',
  '612e9d142affc44a453655db',
  '612e9f1e7e5ccd4fa9ada0be',
  '612ea4c4993aba52ab4aa32e',
  '612ea97df5742154772f312e',
  '612ead8788d28655ef8db056',
  '612eaf56b7ba3257fdbfb0db',
  '612eb4893b63c75bb9251ddf',
  '612eb75153591b5e3b1ab65e',
  '612eb7ca8c275d5f89c73333',
  '612eb8e984cd73677a92b7e9',
  '612eb934f64a4d6890a45518',
  '612ebcba99bfa46a15370b11',
  '612ebe7fe6d07e6b76d1cae2',
  '612ebedec97e096c8bf64999',
  '612ebf9a210f2b6d77001e68',
  '612ec0490ae8626e9adf82e4',
  '612ec19d5268da7074941f84',
  '612ec29c84b9a6718b1f5cec',
  // Technical Documentation Page
  '587d78b0367417b2b2512b05',

  // City Skyline
  '5d822fd413a79914d39e98cc',
  '5d822fd413a79914d39e98cd',
  '5d822fd413a79914d39e98ce',
  '5d822fd413a79914d39e98cf',
  '5d822fd413a79914d39e98d0',
  '5d822fd413a79914d39e98d1',
  '5d822fd413a79914d39e98d2',
  '5d822fd413a79914d39e98d3',
  '5d822fd413a79914d39e98d4',
  '5d822fd413a79914d39e98d5',
  '5d822fd413a79914d39e98d6',
  '5d822fd413a79914d39e98d7',
  '5d822fd413a79914d39e98d8',
  '5d822fd413a79914d39e98d9',
  '5d822fd413a79914d39e98da',
  '5d822fd413a79914d39e98db',
  '5d822fd413a79914d39e98dc',
  '5d822fd413a79914d39e98dd',
  '5d822fd413a79914d39e98de',
  '5d822fd413a79914d39e98df',
  '5d822fd413a79914d39e98e0',
  '5d822fd413a79914d39e98e1',
  '5d822fd413a79914d39e98e2',
  '5d822fd413a79914d39e98e3',
  '5d822fd413a79914d39e98e4',
  '5d822fd413a79914d39e98e5',
  '5d822fd413a79914d39e98e6',
  '5d822fd413a79914d39e98e7',
  '5d822fd413a79914d39e98e8',
  '5d822fd413a79914d39e98e9',
  '5d822fd413a79914d39e98ea',
  '5d822fd413a79914d39e98eb',
  '5d822fd413a79914d39e98ec',
  '5d822fd413a79914d39e98ed',
  '5d822fd413a79914d39e98ee',
  '5d822fd413a79914d39e98ef',
  '5d822fd413a79914d39e98f0',
  '5d822fd413a79914d39e98f1',
  '5d822fd413a79914d39e98f2',
  '5d822fd413a79914d39e98f3',
  '5d822fd413a79914d39e98f4',
  '5d822fd413a79914d39e98f5',
  '5d822fd413a79914d39e98f6',
  '5d822fd413a79914d39e98f7',
  '5d822fd413a79914d39e98f8',
  '5d822fd413a79914d39e98f9',
  '5d822fd413a79914d39e98fa',
  '5d822fd413a79914d39e98fb',
  '5d822fd413a79914d39e98fc',
  '5d822fd413a79914d39e98fd',
  '5d822fd413a79914d39e98fe',
  '5d822fd413a79914d39e98ff',
  '5d822fd413a79914d39e9900',
  '5d822fd413a79914d39e9901',
  '5d822fd413a79914d39e9902',
  '5d822fd413a79914d39e9903',
  '5d822fd413a79914d39e9904',
  '5d822fd413a79914d39e9905',
  '5d822fd413a79914d39e9906',
  '5d822fd413a79914d39e9907',
  '5d822fd413a79914d39e9908',
  '5d822fd413a79914d39e9909',
  '5d822fd413a79914d39e990a',
  '5d822fd413a79914d39e990b',
  '5d822fd413a79914d39e990c',
  '5d822fd413a79914d39e990d',
  '5d822fd413a79914d39e990e',
  '5d822fd413a79914d39e990f',
  '5d822fd413a79914d39e9910',
  '5d822fd413a79914d39e9911',
  '5d822fd413a79914d39e9912',
  '5d822fd413a79914d39e9913',
  '5d822fd413a79914d39e9914',
  '5d822fd413a79914d39e9916',
  '5d822fd413a79914d39e9917',
  '5d822fd413a79914d39e9918',
  '5d822fd413a79914d39e9919',
  '5d822fd413a79914d39e991a',
  '5d822fd413a79914d39e991b',
  '5d822fd413a79914d39e991c',
  '5d822fd413a79914d39e991d',
  '5d822fd413a79914d39e991e',
  '5d822fd413a79914d39e991f',
  '5d822fd413a79914d39e9920',
  '5d822fd413a79914d39e9921',
  '5d822fd413a79914d39e9922',
  '5d822fd413a79914d39e9923',
  '5d822fd413a79914d39e9924',
  '5d822fd413a79914d39e9925',
  '5d822fd413a79914d39e9926',
  '5d822fd413a79914d39e9927',
  '5d822fd413a79914d39e9928',
  '5d822fd413a79914d39e9929',
  '5d822fd413a79914d39e992a',
  '5d822fd413a79914d39e992b',
  '5d822fd413a79914d39e992c',
  '5d822fd413a79914d39e992d',
  '5d822fd413a79914d39e992e',
  '5d822fd413a79914d39e992f',
  '5d822fd413a79914d39e9930',
  '5d822fd413a79914d39e9932',
  '5d822fd413a79914d39e9933',
  '5d822fd413a79914d39e9915',
  '5d822fd413a79914d39e9934',
  '5d822fd413a79914d39e9935',
  '5d822fd413a79914d39e9931',
  '5d822fd413a79914d39e9936',
  '5d822fd413a79914d39e9937',
  '5d822fd413a79914d39e9938',
  '5d822fd413a79914d39e9939',
  '5d822fd413a79914d39e993a',
  '5d822fd413a79914d39e993b',
  '5d822fd413a79914d39e993c',
  '5d822fd413a79914d39e993d',
  '5d822fd413a79914d39e993e',
  // Magazine

  // Product Landing Page
  '587d78af367417b2b2512b04',

  // Ferris Wheel

  // Penguin
  '619665c9abd72906f3ad30f9',
  '61967e74a8e3690ab6292daa',
  '61968df2acd5550bf1616c34',
  '61a8fe15a6a31306e60d1e89',
  '61968e9243a4090cc805531c',
  '61968f8877c6720d6d61aaf5',
  '619691693bc14b0e528f5a20',
  '6196928658b6010f28c39484',
  '6197f667297bb30a552ce017',
  '619692ff79f5770fc6d8c0b4',
  '6196990f966e8f10a40094f6',
  '619699c10a0f6e11591d73c4',
  '61969aa6acef5b12200f672e',
  '61969c487ced6f12db8fef94',
  '61969d66cfcdba137d021558',
  '61969e7451455614217e901b',
  '6196adc17f77a714d51485f2',
  '6196aead7ac7bf1584b17a7f',
  '6196ce0415498d2463989e84',
  '6196cee94c6da1253809dff9',
  '6196d00a5d7292262bc02f4c',
  '6196d0cda039d026f7f78d1e',
  '6196d1ac33c68d27dcda5796',
  '6196d213d99f16287bff22ae',
  '6196d2c0f22ca0293107c048',
  '6196d32d1340d829f0f6f57d',
  '6196d41d40bf9b2aaea5d520',
  '6197cff995d03905b0cca8ad',
  '6197f40a16afea068c7e60c8',
  '61993b72e874e709b8dfd666',
  '61993cf26a8e0f0a553db223',
  '61993dbb35adf30b10d49e38',
  '61993e9adc9e9a0bb4d28fff',
  '6199409834ccaf0d10736596',
  '6199429802b7c10dc79ff871',
  '619943285a41720e6370d985',
  '619943876b706d0f35c01dbc',
  '6199442866286d0ff421a4fc',
  '619bcf239fc15905ecd66fce',
  '619be73b3c806006ccc00bb0',
  '619be7af7b0bf60770f5d2a4',
  '619be80062551a080e32c821',
  '619be8ce4ea49008c5bfbc30',
  '619be946958c6009844f1dee',
  '619c155df0063a0a3fec0e32',
  '619c16debd0c270b01c5ce38',
  '619cfdf2e63ddf05feab86ad',
  '619d019488f98c06acbbb71a',
  '619d022dc8400c0763829a17',
  '619d02c7bc95bf0827a5d296',
  '619d033915012509031f309a',
  '619d03dadadb6509a16f4f5f',
  '619d0503e03a790a4179d463',
  '619d05c54dabca0b10058235',
  '619d0882f54bf40bdc4671ed',
  '619d090cd8d6db0c93dc5087',
  '619d0b51ca42ed0d74582186',
  '619d0bc9cb05360e1bf549c3',
  '619d0c1594c38c0ebae75878',
  '619d0d18ca99870f884a7bff',
  '619d0daf214542102739b0da',
  '619d0e56f9ca9710fcb974e3',
  '619d0eec0ac40611b41e2ccc',
  '619d0fc9825c271253df28d4',
  '619d102d786c3d13124c37c6',
  '619d107edf7ddf13cc77106a',
  '619d10cc98145f14820399c5',
  '619d115e2adcd71538e82ebb',
  '619d11e6d5ef9515d2a16033',
  '619d129a417d0716a94de913',
  '619d1340361095175f4b5115',
  '619d15797b580c1828b05426',
  '619d15d955d9d418c4487bbc',
  '619d1629a8adc61960ca8b40',
  '619d1c5fc9f8941a400955da',
  '619d1dab9ff3421ae1976991',
  '619d1deb8b04811b8839ffe4',
  '619d1e7a8e81a61c5a819dc4',
  '619d1ed33c9a071cf657a0d6',
  '619d1fb5d244c31db8a7fdb7',
  '619d204bd73ae51e743b8e94',
  '619d20b12996101f430920fb',
  '619d21fe6a3f9b2016be9d9d',
  '619d229b0e542520cd91c685',
  '619d23089e787e216a7043d6',
  '619d237a107c10221ed743fa',
  '619d26b12e651022d80cd017',
  '619d2712853306238f41828e',
  '619d2b7a84e78b246f2d17a2',
  '619d2bd9c1d43c2526e96f1f',
  '619d2d4e80400325ff89664a',
  '619d2ebc81ba81271460850d',
  '619d2f0e9440bc27caee1cec',
  '619d2fd3ff4f772882e3d998',
  '619d30350883802921bfcccc',
  '619d324f5915c929f36ae91d',
  '619d32c7fa21f32aaa91d499',
  '619d333b738e3c2b5d58b095',
  '619d337765b9f02c10e93722',
  '619d33c51140292cc5a21742',
  '619d3482f505452d861d0f62',
  '619d3561a951bf2e41a24f10',
  '619d36103839c82efa95dd34',
  '619d3711d04d623000013e9e',
  // Personal Portfolio
  'bd7158d8c242eddfaeb5bd13',

  /*** JavaScript ***/

  // Rock, Paper, Scissors Game

  // Palindrome Checker
  '657bdc55a322aae1eac3838f',

  // Date Formatter

  // Decimal to Binary Converter

  // Number Sorter Project

  // Quick Sort Algorithm
  '587d825a367417b2b2512c89',

  // Roman Numeral Converter
  '657bdc8ba322aae1eac38390',

  // Dice Game Project

  // Telephone Number Validator
  '657bdcb9a322aae1eac38391',

  // Cash Register
  'aa2e6f85cab2ab736c9a9b24',

  // Shopping Cart

  // Stacks
  '587d8250367417b2b2512c5f',

  // Depth-first Search
  '587d825d367417b2b2512c96',

  // Nth Fibonacci Number

  // FCC Authors Page

  // Weather App

  // Forum Leaderboard

  // Pokemon Search
  '6555c1d3e11a1574434cf8b5',

  /*** Front End Libraries ***/

  // 25+5 Clock
  'bd7158d8c442eddfaeb5bd0f',

  /*** Relational Database ***/

  // Build a Boilerplate
  '5ea8adfab628f68d805bfc5e',

  // Mario Database
  '5f2c289f164c29556da632fd',

  // Celestial Bodies Database
  '5f1a4ef5d5d6b5ab580fc6ae',

  // Build Five Programs
  '5f5904ac738bc2fa9efecf5a',

  // Student Database: Part 1
  '602da0c222201c65d2a019f5',

  // Student Database: Part 2
  '618590adb0730ca724e37672',

  // World Cup Database
  '5f9771307d4d22b9d2b75a94',

  // Kitty Ipsum Translator
  '602da0de22201c65d2a019f6',

  // Bike Rental Shop
  '5f5b969a05380d2179fe6e18',

  // Salon Appointment Scheduler
  '5f87ac112ae598023a42df1a',

  // Nano Castle
  '5f32db63eb37f7e17323f459',

  // Git SQL Reference Object
  '5fa323cdaf6a73463d590659',

  // Periodic Table Database
  '602d9ff222201c65d2a019f2',

  // Number Guessing Game
  '602da04c22201c65d2a019f4',

  /*** Back End JavaScript ***/

  // Managing Packages with NPM
  '587d7fb3367417b2b2512bfb',
  '587d7fb3367417b2b2512bfc',
  '587d7fb4367417b2b2512bfd',
  '587d7fb4367417b2b2512bfe',
  '587d7fb4367417b2b2512bff',
  '587d7fb4367417b2b2512c00',
  '587d7fb5367417b2b2512c01',
  '587d7fb5367417b2b2512c02',
  '587d7fb5367417b2b2512c03',
  '587d7fb5367417b2b2512c04',

  // Basic Node and Express
  '5a8b073d06fa14fcfde687aa',
  '587d7fb0367417b2b2512bed',
  '587d7fb0367417b2b2512bee',
  '587d7fb0367417b2b2512bef',
  '587d7fb0367417b2b2512bf0',
  '587d7fb1367417b2b2512bf1',
  '587d7fb1367417b2b2512bf2',
  '587d7fb1367417b2b2512bf3',
  '587d7fb1367417b2b2512bf4',
  '587d7fb2367417b2b2512bf5',
  '587d7fb2367417b2b2512bf6',
  '587d7fb2367417b2b2512bf7',
  '587d7fb2367417b2b2512bf8',

  // Timestamp Microservice
  'bd7158d8c443edefaeb5bdef',

  // Request Header Parser Microservice
  'bd7158d8c443edefaeb5bdff',

  // URL Shortener Microservice
  'bd7158d8c443edefaeb5bd0e',

  // Exercise Tracker
  '5a8b073d06fa14fcfde687aa',

  // File Metadata Microservice
  'bd7158d8c443edefaeb5bd0f',

  /*** Legacy Only ***/

  // Caesars Cipher
  '56533eb9ac21ba0edf2244e2'
];

class MongoIds {
  constructor() {
    this.knownIds = [];
  }
  check(id, title) {
    try {
      schema.validate(id);
    } catch {
      return `Expected a valid ObjectId for ${title}, but got ${id}`;
    }

    const idIndex = findIndex(this.knownIds, existing => id === existing);
    if (idIndex !== -1 && !duplicatedProjectIds.includes(id)) {
      return `The id for challenge ${title} appears more than once. With the exception of duplicatedProjectIds this should not happen.`;
    }
    this.knownIds = [...this.knownIds, id];
    return null;
  }
}

module.exports = MongoIds;

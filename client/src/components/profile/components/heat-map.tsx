// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CalendarHeatMap from 'react-calendar-heatmap';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import isEqual from 'date-fns/isEqual';
import startOfDay from 'date-fns/startOfDay';
import React, { Component } from 'react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import { Row, Spacer } from '@freecodecamp/ui';

import 'react-calendar-heatmap/dist/styles.css';
import './heatmap.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import envData from '../../../../config/env.json';
import { getLangCode } from '../../../../../shared/config/i18n';
import { User } from '../../../redux/prop-types';
import FullWidthRow from '../../helpers/full-width-row';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { clientLocale } = envData;

const localeCode = getLangCode(clientLocale);

interface HeatMapProps {
  calendar: User['calendar'];
}

interface PageData {
  startOfCalendar: Date;
  endOfCalendar: Date;
}

interface CalendarData {
  date: Date;
  count: number;
}

interface HeatMapInnerProps {
  calendarData: CalendarData[];
  pages: PageData[];
  points?: number;
  t: TFunction;
}

interface HeatMapInnerState {
  pageIndex: number;
}

class HeatMapInner extends Component<HeatMapInnerProps, HeatMapInnerState> {
  constructor(props: HeatMapInnerProps) {
    super(props);

    this.state = {
      pageIndex: this.props.pages.length - 1
    };

    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  prevPage() {
    this.setState(
      {
        pageIndex: this.state.pageIndex - 1
      },
      () => ReactTooltip.rebuild()
    );
  }

  nextPage() {
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1
      },
      () => ReactTooltip.rebuild()
    );
  }

  render() {
    const { calendarData, pages, t } = this.props;
    const { startOfCalendar, endOfCalendar } = pages[this.state.pageIndex];
    const title = `${startOfCalendar.toLocaleDateString([localeCode, 'en-US'], {
      year: 'numeric',
      month: 'short'
    })} - ${endOfCalendar.toLocaleDateString([localeCode, 'en-US'], {
      year: 'numeric',
      month: 'short'
    })}`;
    const dataToDisplay = calendarData.filter(
      data => data.date >= startOfCalendar && data.date <= endOfCalendar
    );

    return (
      <FullWidthRow>
        <section className='card'>
          <h2>{t('profile.activity')}</h2>
          <Spacer size='m' />

          <CalendarHeatMap
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            classForValue={(value: any) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (!value || value.count < 1) return 'color-empty';
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (value.count < 4) return 'color-scale-1';
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (value.count < 8) return 'color-scale-2';
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (value.count >= 8) return 'color-scale-a-lot';
              return 'color-empty';
            }}
            endDate={endOfCalendar}
            startDate={startOfCalendar}
            tooltipDataAttrs={(value: { count: number; date: Date }) => {
              const dateFormatted: string =
                value && value.date
                  ? value.date.toLocaleDateString([localeCode, 'en-US'], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : '';
              if (!value || value.count < 0) {
                return { 'data-tip': '' };
              }
              // Use singular translation if count == 1 else plural
              if (value.count === 1) {
                return {
                  'data-tip': t('profile.points-singular', {
                    count: value.count,
                    date: dateFormatted
                  })
                };
              }
              return {
                'data-tip': t('profile.points-plural', {
                  count: value.count,
                  date: dateFormatted
                })
              };
            }}
            values={dataToDisplay}
          />
          <ReactTooltip className='react-tooltip' effect='solid' html={true} />
          <Row className='text-center'>
            <button
              className='heatmap-nav-btn'
              disabled={!pages[this.state.pageIndex - 1]}
              // eslint-disable-next-line @typescript-eslint/unbound-method
              onClick={this.prevPage}
              style={{
                visibility: pages[this.state.pageIndex - 1] ? 'unset' : 'hidden'
              }}
            >
              &lt;
            </button>
            <span>{title}</span>
            <button
              className='heatmap-nav-btn'
              disabled={!pages[this.state.pageIndex + 1]}
              // eslint-disable-next-line @typescript-eslint/unbound-method
              onClick={this.nextPage}
              style={{
                visibility: pages[this.state.pageIndex + 1] ? 'unset' : 'hidden'
              }}
            >
              &gt;
            </button>
          </Row>
          <Spacer size='m' />
        </section>
      </FullWidthRow>
    );
  }
}

const HeatMap = (props: HeatMapProps): JSX.Element => {
  const { t } = useTranslation();
  const { calendar } = props;

  /**
   *  the following logic creates the data for the heatmap
   *  from the users calendar
   */

  // create array of timestamps and turn into milliseconds
  const timestamps = Object.keys(calendar).map(
    stamp => Number.parseInt(stamp, 10) * 1000
  );
  const startOfTimestamps = startOfDay(new Date(timestamps[0]));
  let endOfCalendar = startOfDay(Date.now());
  let startOfCalendar;

  // creates pages for heatmap
  const pages: PageData[] = [];

  do {
    startOfCalendar = addDays(addMonths(endOfCalendar, -6), 1);

    const newPage = {
      startOfCalendar: startOfCalendar,
      endOfCalendar: endOfCalendar
    };

    pages.push(newPage);

    endOfCalendar = addDays(startOfCalendar, -1);
  } while (startOfTimestamps < startOfCalendar);

  pages.reverse();

  const calendarData: CalendarData[] = [];
  let dayCounter = pages[0].startOfCalendar;

  // create an object for each day of the calendar period
  while (dayCounter <= pages[pages.length - 1].endOfCalendar) {
    // this is the format needed for react-calendar-heatmap
    const newDay = {
      date: startOfDay(dayCounter),
      count: 0
    };

    calendarData.push(newDay);
    dayCounter = addDays(dayCounter, 1);
  }

  // add a point to each day with a completed timestamp
  timestamps.forEach(stamp => {
    const index = calendarData.findIndex(day =>
      isEqual(day.date, startOfDay(stamp))
    );

    if (index >= 0) {
      // add one point for today
      calendarData[index].count++;
    }
  });

  return <HeatMapInner calendarData={calendarData} pages={pages} t={t} />;
};

HeatMap.displayName = 'HeatMap';

export default HeatMap;

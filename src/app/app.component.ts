import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import GSTC, { Config, GSTCResult } from 'gantt-schedule-timeline-calendar';
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from 'gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    './app.component.css',
    '../../node_modules/gantt-schedule-timeline-calendar/dist/style.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  @ViewChild('gstcElement', { static: true }) gstcElement: ElementRef;
  gstc: GSTCResult;

  generateConfig(): Config {
    const iterations = 400;
    // GENERATE SOME ROWS

    const rows = {};
    for (let i = 0; i < iterations; i++) {
      const withParent = i > 0 && i % 2 === 0;
      const id = GSTC.api.GSTCID(i.toString());
      rows[id] = {
        id,
        label: 'Room ' + i,
        parentId: withParent ? GSTC.api.GSTCID((i - 1).toString()) : undefined,
        expanded: false,
      };
    }

    // GENERATE SOME ROW -> ITEMS

    let start = GSTC.api.date().startOf('day').subtract(30, 'day');
    const items = {};
    for (let i = 0; i < iterations; i++) {
      const id = GSTC.api.GSTCID(i.toString());
      start = start.add(1, 'day');
      items[id] = {
        id,
        label: 'User id ' + i,
        time: {
          start: start.valueOf(),
          end: start.add(1, 'day').valueOf(),
        },
        rowId: id,
      };
    }

    // LEFT SIDE LIST COLUMNS

    const columns = {
      percent: 100,
      resizer: {
        inRealTime: true,
      },
      data: {
        [GSTC.api.GSTCID('label')]: {
          id: GSTC.api.GSTCID('label'),
          data: 'label',
          expander: true,
          isHtml: true,
          width: 230,
          minWidth: 100,
          header: {
            content: 'Room',
          },
        },
      },
    };

    return {
      licenseKey:
        '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',
      list: {
        rows,
        columns,
      },
      chart: {
        items,
      },
      plugins: [TimelinePointer(), Selection()],
    };
  }

  ngOnInit(): void {
    const state = GSTC.api.stateFromConfig(this.generateConfig());
    globalThis.state = state;
    this.gstc = GSTC({
      element: this.gstcElement.nativeElement,
      state,
    });
    globalThis.gstc = this.gstc;
  }

  updateFirstItem(): void {
    this.gstc.state.update(
      `config.chart.items.${GSTC.api.GSTCID('0')}`,
      (item) => {
        item.label = 'Dynamically updated!';
        return item;
      }
    );
  }

  updateFirstRow(): void {
    this.gstc.state.update(
      `config.list.rows.${GSTC.api.GSTCID('0')}`,
      (row) => {
        row.label = 'Dynamically updated!';
        return row;
      }
    );
  }

  scrollToCurrentTime(): void {
    this.gstc.api.scrollToTime(GSTC.api.date().valueOf());
  }

  clearSelection(): void {
    this.gstc.api.plugins.Selection.selectCells([]);
    this.gstc.api.plugins.Selection.selectItems([]);
  }
}

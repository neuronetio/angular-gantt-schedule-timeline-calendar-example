import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  template:
    '<div><button (click)="changeFrom()">change from</button><gstc [config]="config" [onState]="onState.bind(this)"></gstc></div>'
})
export class AppComponent implements OnInit {
  title = "ng-gstc-test";

  config: any;
  gstcState: any;

  ngOnInit() {
    const iterations = 400;

    // GENERATE SOME ROWS

    const rows = {};
    for (let i = 0; i < iterations; i++) {
      const withParent = i > 0 && i % 2 === 0;
      const id = i.toString();
      rows[id] = {
        id,
        label: "Room " + i,
        parentId: withParent ? (i - 1).toString() : undefined,
        expanded: false
      };
    }

    const dayLen = 24 * 60 * 60 * 1000;

    // GENERATE SOME ROW -> ITEMS

    const items = {};
    for (let i = 0; i < iterations; i++) {
      const id = i.toString();
      const start = new Date().getTime();
      items[id] = {
        id,
        label: "User id " + i,
        time: {
          start: start + i * dayLen,
          end: start + (i + 2) * dayLen
        },
        rowId: id
      };
    }

    // LEFT SIDE LIST COLUMNS

    const columns = {
      percent: 100,
      resizer: {
        inRealTime: true
      },
      data: {
        label: {
          id: "label",
          data: "label",
          expander: true,
          isHtml: true,
          width: 230,
          minWidth: 100,
          header: {
            content: "Room"
          }
        }
      }
    };

    this.config = {
      height: 800,
      list: {
        rows,
        columns
      },
      chart: {
        items
      }
    };
  }

  // GET THE GANTT INTERNAL STATE

  onState(state) {
    this.gstcState = state;
    console.log(this);

    // YOU CAN SUBSCRIBE TO CHANGES

    this.gstcState.subscribe("config.list.rows", rows => {
      console.log("rows changed", rows);
    });

    this.gstcState.subscribe(
      "config.chart.items.:id",
      (bulk, eventInfo) => {
        if (eventInfo.type === "update" && eventInfo.params.id) {
          const itemId = eventInfo.params.id;
          console.log(
            `item ${itemId} changed`,
            this.gstcState.get("config.chart.items." + itemId)
          );
        }
      },
      { bulk: true }
    );
  }

  changeFrom() {
    const from = new Date().getTime() + 24 * 60 * 60 * 1000 * 4;
    this.gstcState.update("config.chart.time.from", from);
  }
}

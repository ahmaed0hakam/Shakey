import { ChangeDetectionStrategy, Component, signal, EventEmitter, Output } from '@angular/core';
import { DateRange, MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, formatDate } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatAccordion, matExpansionAnimations, MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';


@Component({
    selector: 'app-sidebar',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [CommonModule, MatCalendar, MatAccordion, MatExpansionPanel, MatCard],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.sass'
})
export class SidebarComponent {

    readonly panelOpenState = signal(false);

    filters: any = {
    }
    selectedRangeValue: DateRange<Date> | undefined;

    pastDate = new Date(1970);

    @Output() filtersChange = new EventEmitter<any>();

    selectedDateChange(m: any) {
        if (!this.selectedRangeValue?.start || this.selectedRangeValue?.end) {
            this.selectedRangeValue = new DateRange<Date>(m, null);
        } else {
            const start = this.selectedRangeValue.start;
            const end = m;
            if (end < start) {
                this.selectedRangeValue = new DateRange<Date>(end, start);
            } else {
                this.selectedRangeValue = new DateRange<Date>(start, end);
            }
        }
        const from = this?.selectedRangeValue?.start?.toDateString() || '';
        const to = this?.selectedRangeValue?.end?.toDateString() || '';

        this.filters.from = from ? formatDate(from, 'yyyy-MM-dd', 'en-US') : '';
        this.filters.to = to ? formatDate(to, 'yyyy-MM-dd', 'en-US') : '';

        console.log(this.filters);
    }

    search() {
        // Emit the filters when the search is triggered
        this.filtersChange.emit(this.filters);
      }
}

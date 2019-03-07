import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
    selector: 'camel-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public showInfoModal1: boolean = false;
    public showInfoModal2: boolean = false;

    constructor() {
    }

    ngOnInit() {

    }

    /**
     * Opens info Modal for wertversand
     */
    public openInfo1() {
        this.showInfoModal1 = true;
    }

    /**
     * Opens info Modal for Waffenversand
     */
    public openInfo2() {
        this.showInfoModal2 = true;
    }
}

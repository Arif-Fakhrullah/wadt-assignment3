import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Group } from '../../model/group.model';
import { AttendanceService } from '../../attendance.service';

@Component({
  selector: 'app-list-gl',
  templateUrl: './list-gl.component.html',
  styleUrls: ['./list-gl.component.scss']
})
export class ListGlComponent implements OnInit {
    groups$: Observable<Group[]>;
    readonly path = "groups";
    constructor(
        private groupService: AttendanceService
    ) {}

    ngOnInit() {
        this.groups$ = this.groupService.getCollection$(this.path, ref =>
          ref.orderBy("gc", "asc")
        );
    }

}

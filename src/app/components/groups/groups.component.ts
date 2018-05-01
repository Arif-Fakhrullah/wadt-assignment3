import { Component, OnInit, TemplateRef } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Group } from './../../model/group.model';
import { AttendanceService } from './../../attendance.service';
import { AlertComponent } from "ngx-bootstrap/alert/alert.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

@Component({
  selector: "app-groups",
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.scss"]
})
export class GroupsComponent implements OnInit {
  groups$: Observable<Group[]>;
    
  readonly path = "groups";

  groupForm: FormGroup;

  // Used by AlertComponent
  alerts: any[] = [];

  modalRef: BsModalRef;
  message: string;

  // Boolean for checking if updating
  updating: boolean;

  constructor(
    private groupService: AttendanceService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    // Form validation, Submit button will only work if all valid
    this.groupForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(5)]),
      quantity: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]),
      gc: new FormControl("", Validators.required),
      gl: new FormControl("", Validators.required),
      id: new FormControl("")
    });

    this.groups$ = this.groupService.getCollection$(this.path, ref =>
      ref.orderBy("name", "asc")
    );

    this.updating = false; // setting initial state of updating boolean
  }

  // Saving group
  save() {
    // Taking values from input HTML
    const name = this.groupForm.get("name").value;
    const quantity = this.groupForm.get("quantity").value;
    const gc = this.groupForm.get("gc").value;
    const gl = this.groupForm.get("gl").value;
    // sending off to service to save
    this.groupService.add(this.path, { name, quantity, gc, gl });
    this.addedGroupMessage(); // Show confirmation
    this.groupForm.reset(); // clears form
  }

  updateGroup(): void {
    console.log("Updating document: " + this.groupForm.get("id").value);
    const id = this.groupForm.get("id").value;
    const name = this.groupForm.get("name").value;
    const quantity = this.groupForm.get("quantity").value;
    const gc = this.groupForm.get("gc").value;
    const gl = this.groupForm.get("gl").value;
    const updated =  new Date();

    const group: Partial<Group> = { name, quantity, gc, gl, updated };
    // sending off to service to update, needs id and other data
    this.groupService.update(this.path, id, group);
    this.groupForm.reset(); // clears form
  }

  // Delete Group
  remove(id: string) {
    this.groupService.remove(this.path, id);
    this.modalRef.hide();
    this.removedGroupMessage();
  }

  // Populate input form
  fill(group: Group) {
    // Enable Update Button
    this.updating = true;
    // Fill in form
    this.groupForm.setValue({
      name: group.name,
      gl: group.gl,
      gc: group.gc,
      quantity: group.quantity,
      id: group.id
    });
  }

  // Clear form
  reset(): void {
    this.groupForm.reset();
  }

  // Alert stuff, such as success in adding new data into DB
  addedGroupMessage(): void {
    this.alerts.push({
      type: "success",
      msg: "Saved group into database",
      timeout: 3000 // in miliseconds 1000 is 1 second
    });
  }

  removedGroupMessage(): void {
    this.alerts.push({
      type: "warning",
      msg: "Removed group from database",
      timeout: 3000 // in miliseconds 1000 is 1 second
    });
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  // Modal stuff
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  decline(): void {
    this.modalRef.hide();
  }
}

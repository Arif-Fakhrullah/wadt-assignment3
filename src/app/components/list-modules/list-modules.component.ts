import { Component, OnInit, TemplateRef } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Module } from './../../model/module.model';
import { AttendanceService } from './../../attendance.service';
import { AlertComponent } from "ngx-bootstrap/alert/alert.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";

@Component({
  selector: 'app-list-modules',
  templateUrl: './list-modules.component.html',
  styleUrls: ['./list-modules.component.scss']
})
export class ListModulesComponent implements OnInit {

  modules$: Observable<Module[]>;
    
  readonly path = "modules";

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
      ml: new FormControl("", Validators.required),
      //id: new FormControl("")
    });

    this.modules$ = this.groupService.getCollection$(this.path, ref =>
      ref.orderBy("name", "asc")
    );

    this.updating = false; // setting initial state of updating boolean
  }
  
  // Saving group
  save() {
    // Taking values from input HTML
    const name = this.groupForm.get("name").value;
    const ml = this.groupForm.get("ml").value;
    // sending off to service to save
    this.groupService.add(this.path, { name, ml });
    //this.addedGroupMessage(); // Show confirmation
    this.groupForm.reset(); // clears form
  }
    
  updateGroup(): void {
    console.log("Updating document: " + this.groupForm.get("id").value);
    const id = this.groupForm.get("id").value;
    const name = this.groupForm.get("name").value;
    const ml = this.groupForm.get("ml").value;
    const updated =  new Date();

    const model: Partial<Module> = { name, ml };
    // sending off to service to update, needs id and other data
    this.groupService.update(this.path, id, module);
    this.groupForm.reset(); // clears form
  }
  
  remove(id: string) {
    this.groupService.remove(this.path, id);
    this.modalRef.hide();
    //this.removedGroupMessage();
  }
 
  // Populate input form
  fill(group: Module) {
    // Enable Update Button
    this.updating = true;
    // Fill in form
    this.groupForm.setValue({
      name: group.name,
      ml: group.ml,
      id: group.id
    });
  }

  // Clear form
  /*reset(): void {
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
  */

}
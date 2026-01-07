// src/pages/todo/create.todo.ts

import {
  CreateTheConnectionLocal,
  LocalSyncData,
  MakeTheInstanceConceptLocal,
  PatcherStructure,
  PRIVATE,
  UpdateComposition
} from "mftsccs-browser";

import { StatefulWidget } from "mftsccs-browser";
import "./todo.style.css";
import { getLocalUserId } from "../user/login.service";

export class create extends StatefulWidget {

  after_render(): void {
    let userId: number = getLocalUserId();
    let order: number = 1;

    let title = this.getElementById("title") as HTMLInputElement;
    let description = this.getElementById("description") as HTMLInputElement;
    let status = this.getElementById("status") as HTMLSelectElement;
    let id = this.getElementById("id") as HTMLInputElement;

    // EDIT MODE
    if (this.data) {
      title.value = this.data.title;
      description.value = this.data.description;
      status.value = this.data.status;
      id.value = this.data.id;
    }

    let submitButton = this.getElementById("submit");
    if (submitButton) {
      submitButton.onclick = (ev: Event) => {
        ev.preventDefault();

        // UPDATE TASK
        if (id.value) {
          let patcherStructure: PatcherStructure = new PatcherStructure();
          patcherStructure.compositionId = Number(id.value);
          patcherStructure.patchObject = {
            title: title.value,
            description: description.value,
            status: status.value
          };
          UpdateComposition(patcherStructure);
                    // clear form
            title.value = "";
            description.value = "";
            status.value = "pending";
            id.value = "";
            this.data = null;
        }

        // CREATE TASK
        else {
          MakeTheInstanceConceptLocal(
            "the_todo",
            "",
            true,
            userId,
            PRIVATE
          ).then((mainconcept) => {

            MakeTheInstanceConceptLocal(
              "title",
              title.value,
              false,
              userId,
              PRIVATE
            ).then((concept1) => {

              MakeTheInstanceConceptLocal(
                "description",
                description.value,
                false,
                userId,
                PRIVATE
              ).then((concept2) => {

                MakeTheInstanceConceptLocal(
                  "status",
                  status.value,
                  false,
                  userId,
                  PRIVATE
                ).then((concept3) => {

                  CreateTheConnectionLocal(
                    mainconcept.id,
                    concept1.id,
                    mainconcept.id,
                    order,
                    "",
                    userId
                  ).then(() => {

                    CreateTheConnectionLocal(
                      mainconcept.id,
                      concept2.id,
                      mainconcept.id,
                      order,
                      "",
                      userId
                    ).then(() => {

                      CreateTheConnectionLocal(
                        mainconcept.id,
                        concept3.id,
                        mainconcept.id,
                        order,
                        "",
                        userId
                      ).then(() => {
                        LocalSyncData.SyncDataOnline();
                        // ✅ CLEAR FORM AFTER SUBMIT
                            title.value = "";
                            description.value = "";
                            status.value = "pending";
                            id.value = "";

                        // ✅ Clear edit data so it doesn't stay in edit mode
                            this.data = null;
                      });

                    });
                  });
                });
              });
            });
          });
        }
      };
    }
  }

  getHtml(): string {
    return `
      <div class="container">
        <form>
          <input type="number" id="id" hidden />

          <div class="formbody">
            <label>Title</label>
            <input type="text" id="title" placeholder="Task title" />
          </div>

          <div class="formbody">
            <label>Description</label>
            <textarea id="description" placeholder="Task description"></textarea>
          </div>

          <div class="formbody">
            <label>Status</label>
            <select id="status">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button class="btn btn-primary" id="submit" type="submit">
            Submit
          </button>
        </form>
      </div>
    `;
  }
}

// src/pages/todo/list.todo.ts

import {
  DeleteConceptById,
  GetCompositionListListener,
  NORMAL
} from "mftsccs-browser";

import { StatefulWidget } from "mftsccs-browser";
import { getLocalUserId } from "../user/login.service";
import "./todo.style.css";

export class list extends StatefulWidget {

  mytodos: any[] = [];
  inpage: number = 10;
  page: number = 1;

  before_render(): void {
    let userId: number = getLocalUserId();

    GetCompositionListListener(
      "the_todo",
      userId,
      this.inpage,
      this.page,
      NORMAL
    ).subscribe((output: any) => {
      this.mytodos = output;
      console.log("Todo list:", output);
      this.render();
    });
  }

  after_render(): void {
    let tableBody = this.getElementById("mainbody");

    if (!tableBody || this.mytodos.length === 0) {
      return;
    }

    tableBody.innerHTML = "";

    for (let i = 0; i < this.mytodos.length; i++) {
      let todo = this.mytodos[i].the_todo;

      if (!todo?.id) continue;

      let row = document.createElement("tr");

      // TITLE
      let col1 = document.createElement("td");
      col1.innerText = todo.title || "";

      // DESCRIPTION
      let col2 = document.createElement("td");
      col2.innerText = todo.description || "";

      // STATUS
      let col3 = document.createElement("td");
      col3.innerText = todo.status || "pending";

      // DELETE
      let col4 = document.createElement("td");
      let delBtn = document.createElement("button");
      delBtn.className = "btn btn-primary";
      delBtn.innerText = "Delete";
      delBtn.onclick = () => {
        DeleteConceptById(todo.id).then(() => {
          console.log("Todo deleted");
        });
      };
      col4.appendChild(delBtn);

      // EDIT
      let col5 = document.createElement("td");
      let editBtn = document.createElement("button");
      editBtn.className = "btn btn-primary";
      editBtn.innerText = "Edit";
      editBtn.onclick = () => {
        this.data = {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          status: todo.status
        };
        this.notify();
      };
      col5.appendChild(editBtn);

      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      row.appendChild(col4);
      row.appendChild(col5);

      tableBody.appendChild(row);
    }
  }

  getHtml(): string {
    return `
      <div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody id="mainbody"></tbody>
        </table>
      </div>
    `;
  }
}

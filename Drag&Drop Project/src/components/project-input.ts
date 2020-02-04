import { Component } from "./base-components.js";
import { TemplateInsertPosition } from "../models/project.js";
import { Autobind } from "../decorators/autobind.js";
import { Validatable, validate } from "./../utils/validation.js";
import { projectState } from "./../state/project-state.js";

// Project input class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleEl: HTMLInputElement;
  descriptionEl: HTMLTextAreaElement;
  peopleEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", TemplateInsertPosition.AfterBegin, "user-input");

    this.titleEl = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionEl = this.element.querySelector("#description") as HTMLTextAreaElement;
    this.peopleEl = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
  }

  @Autobind
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleEl.value,
      description = this.descriptionEl.value,
      people = +this.peopleEl.value;

    const titleValidatable: Validatable = {
      value: title,
      required: true
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5
    };
    const peopleValidatable: Validatable = {
      value: people,
      required: true,
      min: 1,
      max: 5
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
    } else {
      return [title, description, people];
    }
  }

  private clearInputs() {
    this.titleEl.value = "";
    this.descriptionEl.value = "";
    this.peopleEl.value = "";
  }

  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}

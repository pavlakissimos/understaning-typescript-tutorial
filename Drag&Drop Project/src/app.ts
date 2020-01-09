// Autobind decorator
function Autobind(_target: any, _methodName: string | Symbol, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };

  return adjustedDescriptor;
}

// Project input class
class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleEl: HTMLInputElement;
  descriptionEl: HTMLTextAreaElement;
  peopleEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById("project-input")! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleEl = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionEl = this.element.querySelector("#description") as HTMLTextAreaElement;
    this.peopleEl = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleEl.value,
      description = this.descriptionEl.value,
      people = +this.peopleEl.value;

    if (!title.length && !description.length && people > 0) {
      alert("Invalid input, please try again!");
    } else {
      return [title, description, people];
    }
  }

  @Autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      console.log(title, description, people);
    }
  }

  @Autobind
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
}

const projectInput = new ProjectInput();

// Create project
class Project {
  // @TruthyValue
  title!: string;
  // @TruthyValue
  description!: string;
  // @TruthyValue
  people!: number;

  constructor(title: string, description: string, people: number) {
    this.title = title;
    this.description = description;
    this.people = people;
  }
}

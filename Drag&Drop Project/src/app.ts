enum ProjectStatus {
  Active,
  Finished
}

enum TemplateInsertPosition {
  AfterBegin = "afterbegin",
  BeforeEnd = "beforeend"
}

// Project Type
class Project {
  id: string;
  title: string;
  description: string;
  people: number;
  status: ProjectStatus;

  constructor(
    id: string,
    title: string,
    description: string,
    people: number,
    status: ProjectStatus
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.people = people;
    this.status = status;
  }
}

// Project State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

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

// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  max?: number;
  min?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && !!validatableInput.value.toString().length;
  }

  // String values
  if (typeof validatableInput.value === "string") {
    if (validatableInput.minLength != null) {
      isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null) {
      isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
  }

  // Number values
  if (typeof validatableInput.value === "number") {
    if (validatableInput.min != null) {
      isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null) {
      isValid = isValid && validatableInput.value <= validatableInput.max;
    }
  }

  return isValid;
}

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostElId: string,
    insertPosition: TemplateInsertPosition,
    newElId?: string
  ) {
    this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElId)! as T;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElId) {
      this.element.id = newElId;
    }

    this.attach(insertPosition);
  }

  private attach(insertPosition: TemplateInsertPosition) {
    this.hostEl.insertAdjacentElement(insertPosition, this.element);
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, TemplateInsertPosition.BeforeEnd, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure() {}

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.project.people.toString();
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// ProjectList class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", TemplateInsertPosition.BeforeEnd, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(project => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }
}

// Project input class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const projectInput = new ProjectInput();
const activePrList = new ProjectList("active");
const finishedPrList = new ProjectList("finished");

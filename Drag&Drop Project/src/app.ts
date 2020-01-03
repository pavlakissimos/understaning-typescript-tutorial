// Show form

const app = document.getElementById("app")!;
const projectInput = document.getElementById("project-input") as HTMLTemplateElement;

const projectInputClone = document.importNode(projectInput.content, true);

app.appendChild(projectInputClone);

// Create project

class Project {
  title!: string;
  description!: string;
  people!: number;

  constructor(title: string, description: string, people: number) {
    this.title = title;
    this.description = description;
    this.people = people;
  }

  addProject() {
    console.log(this.title, this.description, this.people);
  }
}

// Form

const form = document.querySelector("form")!;

form.addEventListener("submit", e => {
  e.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const descriptionEl = document.getElementById("description") as HTMLInputElement;
  const peopleEl = document.getElementById("people") as HTMLInputElement;
  const title = titleEl.value;
  const description = descriptionEl.value;
  const people = +peopleEl.value;
  const project = new Project(title, description, people);

  project.addProject();
});

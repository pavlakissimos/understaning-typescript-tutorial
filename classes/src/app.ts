abstract class Department {
  // private readonly id: string;
  // private name: string;
  protected employees: string[] = [];
  static fiscalYear: number = 2020;

  constructor(protected readonly id: string, public name: string) {
    // this.name = name;
    // this.id = id;
  }

  static createEmployee(name: string): object {
    return { name };
  }

  abstract describe(this: Department): void;

  addEmployee(employee: string): void {
    this.employees.push(employee);
  }

  showEmployeeInfo(): void {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  public admins: string[];
  constructor(id: string, admins: string[]) {
    super(id, "IT");
    this.admins = admins;
  }

  describe() {
    console.log("IT Department ID: " + this.id);
  }
}

class AccountingDepartment extends Department {
  private lastReport: string;
  private static instance: AccountingDepartment;
  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }

    throw new Error("No report found.");
  }

  set mostRecentReport(report: string) {
    if (!report) {
      throw new Error("Please pass a valid value!");
    }
    this.addReport(report);
  }

  private constructor(id: string, private reports: string[]) {
    super(id, "Accounting");
    this.lastReport = reports[0];
  }

  static getInstance() {
    if (this.instance) return this.instance;
    return new AccountingDepartment("d2", []);
  }

  describe() {
    console.log("Accounting Department - ID: " + this.id);
  }

  addReport(report: string): void {
    this.reports.push(report);
    this.lastReport = report;
  }

  printReports(): void {
    console.log(this.reports);
  }

  addEmployee(employee: string): void {
    if (this.employees.indexOf(employee) > -1) return;
    this.employees.push(employee);
  }
}

const employee1 = Department.createEmployee("Simon");
console.log(employee1, Department.fiscalYear);

const it = new ITDepartment("d1", ["Simos"]);

it.addEmployee("Simos");
it.addEmployee("Sam");

it.describe();
it.showEmployeeInfo();

console.log(it);

const accounting = AccountingDepartment.getInstance();
const accounting2 = AccountingDepartment.getInstance();

console.log(accounting);
console.log(accounting2);

accounting.addReport("Something went wrong...");
console.log(accounting.mostRecentReport);

accounting.describe();

// accounting.mostRecentReport = "This is a report";
// accounting.printReports();

// const accountingCopy = { name: "Dummy", describe: accounting.describe };

// accountingCopy.describe();

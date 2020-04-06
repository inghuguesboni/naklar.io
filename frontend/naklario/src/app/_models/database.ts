/**
 * sendable interfaces for communication with the api
 */
export interface SendableTutorData {
  schooldata: number[];
  subjects: number[];
}

export interface SendableStudentData {
  school_data: number;
}

export interface SendableUser {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  state: number;
  terms_accepted: boolean;
  studentdata: SendableStudentData | null;
  tutordata: SendableTutorData | null;
}

export interface SendableLogin {
  email: string;
  password: string;
}

/**
 * local objects
 */
export class StudentData {
  constructor(public school_data: SchoolData = new SchoolData()) {}
}

export class TutorData {
  constructor(
    public schooldata: SchoolData[] = [],
    public subjects: Subject[] = []
  ) {}
}

export class User {
  constructor(
    public email: string = "",
    public password: string = "",
    public first_name: string = "",
    public last_name: string = "",
    public state: State = new State(),
    public studentdata: StudentData | null = new StudentData(),
    public tutordata: TutorData | null = new TutorData(),
    public terms_accepted: boolean = false,
    public token: string = "",
    public token_expiry: Date = null
  ) {}
}

export class State {
  constructor(
    public id: number = -1,
    public name: string = "",
    public shortcode: string = ""
  ) {}
}

export class Subject {
  constructor(public id: number = -1, public name: string = "") {}
}
export class SchoolType {
  constructor(public id: number = -1, public name: string = "") {}
}

export class SchoolData {
  constructor(
    public id: number = -1,
    public school_type: number = -1,
    public grade: number = -1
  ) {}
}

/**
 *  conversion functions between User <==> SendableUser
 */
export const localToSendable = (user: User): SendableUser => {
  const studentdata: SendableStudentData | null = user.studentdata
    ? {
        school_data: user.studentdata.school_data.id
      }
    : null;
  const tutordata: SendableTutorData | null = user.tutordata
    ? {
        schooldata: user.tutordata.schooldata.map(x => x.id),
        subjects: user.tutordata.subjects.map(x => x.id)
      }
    : null;
  return {
    email: user.email,
    password: user.password,
    first_name: user.first_name,
    last_name: user.last_name,
    state: user.state.id,
    studentdata: studentdata,
    tutordata: tutordata,
    terms_accepted: user.terms_accepted
  };
};

export const sendableToLocal = (user: SendableUser): User => {
  return new User(
    user.email,
    user.password,
    user.first_name,
    user.last_name,
    states.find(x => x.id === user.state),
    user.studentdata
      ? new StudentData(
          schoolData.find(x => x.id === user.studentdata.school_data)
        )
      : null,
    user.tutordata
      ? new TutorData(
          schoolData.filter(x => x.id in user.tutordata.schooldata),
          subjects.filter(x => x.id in user.tutordata.subjects)
        )
      : null
    // TODO: provide token & terms_accepted
  );
};

export const states: State[] = JSON.parse(
  '[{"id":1,"name":"Baden-Württemberg","shortcode":"BW"},{"id":2,"name":"Bayern","shortcode":"BY"},{"id":3,"name":"Berlin","shortcode":"BE"},{"id":4,"name":"Brandenburg","shortcode":"BB"},{"id":5,"name":"Hamburg","shortcode":"HH"},{"id":6,"name":"Hessen","shortcode":"HE"},{"id":7,"name":"Mecklenburg-Vorpommern","shortcode":"MV"},{"id":8,"name":"Niedersachsen","shortcode":"NI"},{"id":9,"name":"Nordrhein-Westfalen","shortcode":"NW"},{"id":10,"name":"Rheinland-Pfalz","shortcode":"RP"},{"id":11,"name":"Saarland","shortcode":"SL"},{"id":12,"name":"Sachsen","shortcode":"SN"},{"id":13,"name":"Sachsen-Anhalt","shortcode":"ST"},{"id":14,"name":"Schleswig-Holstein","shortcode":"SH"},{"id":15,"name":"Thüringen","shortcode":"TH"}]'
);
export const schoolTypes: SchoolType[] = JSON.parse(
  '[{"id":1,"name":"Gymnasium"},{"id":2,"name":"Realschule"},{"id":3,"name":"Mittelschule"},{"id":4,"name":"FOS/BOS"}]'
);
export const schoolData: SchoolData[] = JSON.parse(
  '[{"id":1,"grade":5,"school_type":1},{"id":2,"grade":6,"school_type":1},{"id":3,"grade":7,"school_type":1},{"id":4,"grade":8,"school_type":1},{"id":5,"grade":9,"school_type":1},{"id":6,"grade":10,"school_type":1},{"id":7,"grade":11,"school_type":1},{"id":8,"grade":12,"school_type":1},{"id":9,"grade":13,"school_type":1},{"id":10,"grade":5,"school_type":2},{"id":11,"grade":6,"school_type":2},{"id":12,"grade":7,"school_type":2},{"id":13,"grade":8,"school_type":2},{"id":14,"grade":9,"school_type":2},{"id":15,"grade":10,"school_type":2},{"id":16,"grade":5,"school_type":3},{"id":17,"grade":6,"school_type":3},{"id":18,"grade":7,"school_type":3},{"id":19,"grade":8,"school_type":3},{"id":20,"grade":9,"school_type":3},{"id":21,"grade":10,"school_type":3},{"id":22,"grade":5,"school_type":4},{"id":23,"grade":6,"school_type":4},{"id":24,"grade":7,"school_type":4},{"id":25,"grade":8,"school_type":4},{"id":26,"grade":9,"school_type":4},{"id":27,"grade":10,"school_type":4},{"id":28,"grade":11,"school_type":4},{"id":29,"grade":12,"school_type":4},{"id":30,"grade":13,"school_type":4}]'
);
export const subjects: Subject[] = JSON.parse(
  '[{"id":1,"name":"Deutsch"},{"id":2,"name":"Mathematik"},{"id":3,"name":"Englisch"},{"id":4,"name":"Französisch"},{"id":5,"name":"Latein"},{"id":6,"name":"Physik"},{"id":7,"name":"Chemie"},{"id":8,"name":"Biologie"},{"id":9,"name":"Musik"},{"id":10,"name":"Geschichte"},{"id":11,"name":"Geographie"},{"id":12,"name":"Wirtschaft/Recht"},{"id":13,"name":"Informatik"}]'
);
import { ToastOptions } from "react-toastify";

export interface Alert {
  message: string;
  type: string;
}

export interface AppState {
  loading: boolean;
  loginInfo?:{};
  roleinfo?:[];
  complete?:Complete[];
  participantData?:[];
  cities?:Object;
  types?: any;
  reload: boolean;
  showAlert: boolean;
  alert: Alert;
  value?: boolean;
  prevPath: any[];
  survey: SurveyObj;
  responseSurvey: SurveyObj;
  firstTime?: boolean;
  surveyClick?: boolean;
  sectionNum?: number;
  questionNum?: number;
  errorSection?: number;
  errorSectionOpt?: number;
  errorSectionLab?: number;
  errorQuestion?: number;
  errorQuestionOpt?: number;
  errorQuestionLab?: number;
  submitClick?: number;
  errorOption?: number;
  errorLabel?: number;
  houseHold?: HouseHold;
  refresh?: boolean;
  participant?: FamilyMembers;
  accessToken?: string;
  apiErrorStatusCode?: number;
  defaultSections?: any[];
  userName?: string;
  autocompleteRefresh?: boolean;
  recipeDetails?: RecipeDetails;
  
}
export interface Complete{
  member?:number;
  completed?:boolean
}
export interface RecipeDetails {
  id?: string;
  foodName?: string;
  foodNameArabic?: string;
  weight?: Number;
  portionRequired?: Number;
  Ingredients?: Ingredients[];
  Nutrients?: Nutrients[];
  approveRequest?: boolean;
  foodImage?: FoodImage;
}
export interface FoodImage {
  displayImage?: string;
  portionImages?: string;
  id?: Number;
}

export interface Ingredients {
  ingredientId?: Number;
  ingredientName?: String;
  quantity?: Number;
  FoodId?: string | null;
  Food?: Number | null;
}
export interface Nutrients {
  nutrientId?: Number;
  nutrientName?: String;
  nutrientValue?: Number;
  FoodId?: string | null;
  Food?: Number | null;
}
export interface HouseHold {
  householdId?: number;
  familyCode?: string;
  houseNumber?: number;
  buildingName?: string;
  streetName?: string;
  cityName?: string;
  phoneNumber?: number;
  assignedSurveyId?: number;
  assignedInterviewerId?: number;
  createdId?: number;
  createdDate?: string;
  updatedId?: number;
  updatedDate?: string;
  participants?: FamilyMembers[];
}
export interface FamilyMembers {
  participantId?: number;
  participantCode?: number;
  headOfFamily?: boolean;
  firstName?: string;
  familyName?: string;
  dob?: string;
  genderId?: number;
  maritalStatusId?: number;
  academicLevelId?: number;
  occupationId?: number;
  createdId?: number;
  createdDate?: string;
  updatedId?: number;
  updatedDate?: string;
  householdId?: number;
}
export interface SurveyObj {
  survey: Survey;
}
export interface Survey {
  type?: string;
  details?: Details;
  sections: Sections[];
}
export interface Details {
  label?: string;
  description?: string;
  title?: string;
}
export interface Sections {
  sectionId?: number;
  title?: string;
  conditions?: Conditions[];
  header?: true;
  questions: Questions[];
}
export interface Conditions{
    adult_status?:string,
    gender_status?:string
}
export interface Questions {
  id?: string;
  required?: boolean;
  inputType?: string;
  caption?: string;
  values: Values[];
  next: Next[] | string | number | null;
}
export interface Values {
  option?: string;
  label?: string;
  next?: string;
}
export interface Next {
  option?: string;
  id?: string;
}
export interface DetailsArray {
  firstName: "";
  familyName: "";
  gender: "";
  age: "";
  relationship: "";
  acedemicLevel: "";
  maritalStatus: "";
  occupation: "";
}
export interface ToastProps extends ToastOptions {
  message: string;
  toastId?: string;
}

export interface RootState {
  app: AppState;
}

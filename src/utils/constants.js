export const PATHS = {
  login: "/",
  dashboard: "/dashboard",
  Survey: {
    root: "/survey/viewSurvey",
    createSurvey: "/survey/createSurvey",
    viewSurvey: "/survey/viewSurvey/view",
    assignSurvey: "/survey/assignSurvey",
    survey: "/survey/viewSurvey/each",
    surveySections: "/survey/createSurvey/section",
    sections: "/survey/section",
    viewSections: "/survey/section/viewSections",
    createSections: "/survey/section/createSections",
  },

  HouseHold: {
    root: "/household",
    addHouseHold: "/household/addHousehold",
    viewHouseHold: "/household/viewHousehold",
    participants: "/household/participants",
    addParticipants: "/household/addParticipant",
    viewParticipants: "/household/viewParticipant",
    assignSurvey: "/household/assignSurvey",
  },
  Reports: {
    root: "/reports",
    viewReports: "/reports/viewReports",
  },
  Roles: "/roles",
  userManagement: {
    root: "/userManagement",
    createUser: "/userManagement/createUser",
    updateUser: "/userManagement/updateUser",
    userLists: "/userManagement",
  },
  Recipes: {
    root: "/recipes",
    edit: "/recipes/recipeEdit",
  },
  Foods: "/foods",

  Contaminants: {
    root: "/Contaminants",
    FoodSearch: "/contaminants/Contaminants",
    createContaminant: "/contaminants/AddContaminants",
    ViewContaminant: "/contaminants/ViewContaminant",
  },
};

export const SM_WIDTH = 1200;

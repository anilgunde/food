import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { PATHS } from "../utils/constants";
import ProtectedRoutes from "./ProtectedRoute";

const NotFound = lazy(() => {
  return import("../Pages/Error/NotFound").then((module) => {
    return module;
  });
});
const MenuBar = lazy(() => {
  return import("../Pages/NavMenu/NavMenu").then((module) => {
    return module;
  });
});
const LoginPage = lazy(() => {
  return import("../Pages/LoginPage/Login").then((module) => {
    return module;
  });
});
const ForgotPassword = lazy(() => {
  return import("../Pages/LoginPage/ForgotPassword").then((module) => {
    return module;
  });
});
const EachSurvey = lazy(() => {
  return import("../components/Survey/EachSurvey").then((module) => {
    return module;
  });
});
const SampleDashboardPage = lazy(() => {
  return import("../Pages/Dashboard/Sample").then((module) => {
    return module;
  });
});
const Survey = lazy(() => {
  return import("../components/Survey/viewSuvey/Table").then((module) => {
    return module;
  });
});
const ViewSurvey = lazy(() => {
  return import("../components/Survey/viewSuvey").then((module) => {
    return module;
  });
});
const CreateSurvey = lazy(() => {
  return import("../components/Survey/CreateSurvey").then((module) => {
    return module;
  });
});
const Sections = lazy(() => {
  return import("../components/Survey/Survey").then((module) => {
    return module;
  });
});
const SectionsMain = lazy(() => {
  return import("../components/Survey/Sections").then((module) => {
    return module;
  });
});
const ViewSections = lazy(() => {
  return import("../components/Survey/Sections/ViewSections/ViewSections").then(
    (module) => {
      return module;
    }
  );
});
const CreateSections = lazy(() => {
  return import(
    "../components/Survey/Sections/createSection/CreateSections"
  ).then((module) => {
    return module;
  });
});
const AssignSurvey = lazy(() => {
  return import("../components/Household/AssignSurvey").then((module) => {
    return module;
  });
});
const CreateUser = lazy(() => {
  return import("../components/UserManagement/CreateUser").then((module) => {
    return module;
  });
});
const AddHouseHold = lazy(() => {
  return import("../components/Household").then((module) => {
    return module;
  });
});

const ViewHouseHold = lazy(() => {
  return import("../components/Household/viewEditHouseHold").then((module) => {
    return module;
  });
});
const Household = lazy(() => {
  return import("../components/Household/Root").then((module) => {
    return module;
  });
});
const Reports = lazy(() => {
  return import("../components/Reports").then((module) => {
    return module;
  });
});
const ReportsView = lazy(() => {
  return import("../components/Reports/ReportView").then((module) => {
    return module;
  });
});
const UserManagement = lazy(() => {
  return import("../components/UserManagement").then((module) => {
    return module;
  });
});
const UpdateUser = lazy(() => {
  return import("../components/UserManagement/userEdit").then((module) => {
    return module;
  });
});
const Recipes = lazy(() => {
  return import("../components/recipes").then((module) => {
    return module;
  });
});
const RecipesEdit = lazy(() => {
  return import("../components/recipes/recipeEdit").then((module) => {
    return module;
  });
});
const Roles = lazy(() => {
  return import("../components/roles").then((module) => {
    return module;
  });
});
const Foods = lazy(() => {
  return import("../components/foods/Foods").then((module) => {
    return module;
  });
});
const Contaminats = lazy(() => {
  return import("../components/Contaminants/Contaminants").then((module) => {
    return module;
  });
});
const AddContaminats = lazy(() => {
  return import("../components/Contaminants/AddContaminants").then((module) => {
    return module;
  });
});

const Contaminants = lazy(() => {
  return import("../components/Contaminants/Index").then((module) => {
    return module;
  });
});

const ViewContaminants = lazy(() => {
  return import("../components/Contaminants/ViewContaminant").then((module) => {
    return module;
  });
});

const HandleRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<LoginPage />} />
    <Route path="/forgotpassword" element={<ForgotPassword />} />
    <Route path="/*" element={<NotFound />} />
    {/* Private Routes */}
    <Route element={<ProtectedRoutes />}>
      <Route element={<MenuBar />}>
        <Route path={PATHS.dashboard} element={<SampleDashboardPage />} />
        <Route path={PATHS.Recipes.root} element={<Recipes />} />
        <Route path={PATHS.Roles} element={<Roles />} />
        <Route path={PATHS.Recipes.edit} element={<RecipesEdit />} />
        <Route path={PATHS.Survey.root} element={<Survey />} />
        <Route path={PATHS.Survey.createSurvey} element={<CreateSurvey />} />
        <Route path={PATHS.Survey.viewSurvey} element={<ViewSurvey />} />
        <Route path={PATHS.HouseHold.assignSurvey} element={<AssignSurvey />} />
        <Route path={PATHS.Survey.survey} element={<EachSurvey />} />
        <Route path={PATHS.Survey.surveySections} element={<Sections />} />
        <Route path={PATHS.Survey.sections} element={<SectionsMain />} />
        <Route path={PATHS.Survey.viewSections} element={<ViewSections />} />
        <Route
          path={PATHS.Survey.createSections}
          element={<CreateSections />}
        />
        <Route path={PATHS.HouseHold.root} element={<Household />} />
        <Route path={PATHS.Foods} element={<Foods />} />
        <Route path={PATHS.Contaminants.root} element={<Contaminants />} />

        <Route path={PATHS.HouseHold.addHouseHold} element={<AddHouseHold />} />
        <Route
          path={PATHS.HouseHold.viewHouseHold}
          element={<ViewHouseHold />}
        />
        <Route path={PATHS.Reports.root} element={<Reports />} />
        <Route path={PATHS.Reports.viewReports} element={<ReportsView />} />
        <Route path={PATHS.userManagement.root} element={<UserManagement />} />
        <Route
          path={PATHS.Contaminants.createContaminant}
          element={<AddContaminats />}
        />
        <Route
          path={PATHS.Contaminants.createContaminant}
          element={<AddContaminats />}
        />
        <Route path={PATHS.Contaminants.FoodSearch} element={<Contaminats />} />
        <Route
          path={PATHS.Contaminants.ViewContaminant}
          element={<ViewContaminants />}
        />
        <Route
          path={PATHS.userManagement.createUser}
          element={<CreateUser />}
        />
        <Route
          path={PATHS.userManagement.updateUser}
          element={<UpdateUser />}
        />
      </Route>
    </Route>
  </Routes>
);

export default HandleRoutes;

import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../../mappers/app";
const appState:AppState = {
  alert: { type: "", message: "" },
  showAlert: false,
  loading: false,
  reload: false,
  value: false,
  loginInfo:{},
  roleinfo:[],
  houseHold:{
    participants:[]
  },
  prevPath:[],
  survey: {
    survey:{
      type: "Food Survey Questionaire",
    "details": {
      "label": "Abu Dhabi Food Survey Questionaire",
      "description": "Abu Dhabi Food Survey Questionaire",
      "title": "Abu Dhabi Food Survey"
    },
    "sections": [
      {
        "sectionId": 0,
        "title": "",
        "conditions": [
          {
          adult_status:"",
          gender_status:""
        }
      ],
        "header": true,
        "questions": [
		{
            "id": "",
            "required": true,
            "inputType": "",
            "caption": "",
            "values": [
              {
                "option": "",
                "label": "",
				        "next": ""
              }
            ],
            "next":[
              {
              "option":"",
              "id":""
            }
          ]
    }
  ]
  }
]
  }
},
  responseSurvey: {
    survey:{
      type: "",
    "details": {
      "label": "",
      "description": "",
      "title": ""
    },
    "sections": [
      {
        "sectionId": 0,
        "title": "",
        "conditions": [
          {
            adult_status:"",
            gender_status:""
          }
        ],
        "header": true,
        "questions": [
		{
            "id": "",
            "required": true,
            "inputType": "",
            "caption": "",
            "values": [
              {
                "option": "",
                "label": "",
				        "next": ""
              }
            ],
            "next":[
              {
              "option":"",
              "id":""
            }
          ]
    }
  ]
  }
]
  }
  },
  firstTime:true,
  surveyClick:false,
  sectionNum:-1
};

const AppSlice = createSlice({
  name: "app",
  initialState: appState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    reload(state) {
      state.reload = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
    showAlert(state, { payload }) {
      state.showAlert = true;
      state.alert.type = payload.type;
      state.alert.message = payload.message;
    },
    hideAlert(state) {
      state.showAlert = false;
      state.alert.type = "";
      state.alert.message = "";
    },
    setLoading(state, { payload }) {
      state.value = payload;
    },
    addFamilyMember(state, { payload }) {
      if (state.houseHold?.participants?.length) {
        state.houseHold.participants = [...state.houseHold?.participants, payload];
        
      } else {
        state.houseHold!.participants = [payload];
      }
    },
    removeFamilyMember(state, { payload }) {
      const index = payload;
      if (state.houseHold?.participants?.length) {
      state.houseHold.participants = state.houseHold.participants?.filter((item,i)=> i !==index)
      
      }
    },
    updatDetails(state, { payload }) {
      if(state.houseHold?.participants?.length){
        const newArray = [...state.houseHold?.participants];
      newArray[payload.memberIndex] = {...newArray?.[payload.memberIndex], ...payload.values};
      state.houseHold.participants = newArray
      }
      else{
        state.houseHold!.participants = [payload.values]
      }
    },
    setAccessToken(state,{payload}){
      state.accessToken = payload
    },
    setTypes(state,{payload}){
      state.types = payload
    },
    setApiErrorStatusCode(state,{payload}){
      state.apiErrorStatusCode = payload
    },
    updateHouseHoldObj(state,{payload}){
      state.houseHold = {...state.houseHold,...payload.valss}
    },
    resetHouseHolds(state){
      state.houseHold = {participants:[]}
    },
    setHouseHold(state,{payload}){
      state.houseHold = payload
    },
    setRefreshForViewHouseHolds(state,{payload}){
      state.refresh = payload
    },
    setParticipant(state,{payload}){
      state.participant = payload
    },
    setSurvey(state, { payload }) {
      state.survey.survey = payload;
    },
    setResponseSurvey(state, { payload }) {
      state.responseSurvey = payload;
    },
    setIsFirstTime(state, { payload }) {
      state.firstTime = payload;
    },
    setSection(state){
      state.survey.survey.sections = []
    },
    setViewSection(state,{payload}){
      state.survey.survey.sections = [payload]
    },
    setSectionNumber(state,{payload}){
      state.sectionNum = payload
    },
    setSurveyClick(state,{payload}){
      state.surveyClick = payload
    },
    addSection(state, { payload }) {
      if (state.survey.survey?.sections?.length) {
        state.survey.survey.sections = [...state.survey.survey?.sections, payload];
        
      } else {
        state.survey.survey.sections = [payload];
        
      }
    },
      addQuestion(state,{payload}){
        const {index,quest} = payload
        if (state.survey.survey?.sections?.[index]?.questions?.length) {
          state.survey.survey.sections[index].questions = [...state.survey.survey.sections[index].questions,quest]
        } else {
          state.survey.survey.sections[index].questions = [quest];
        }
    },
      addValues(state,{payload}){
        const {index,secIndex,opts} = payload
        if (state.survey.survey?.sections?.[secIndex]?.questions?.[index]?.values?.length) {
          state.survey.survey.sections[secIndex].questions[index].values = [...state.survey.survey.sections[secIndex].questions?.[index]?.values,opts]
        } else {
          state.survey.survey.sections[secIndex].questions[index].values = [opts];
        }
    },
    setQuestionTitle(state,{payload}){
      const{index,questIndex} = payload
      state.survey.survey.sections[index].questions[questIndex].caption = payload?.message
      state.survey.survey.sections[index].questions[questIndex].id = questIndex+1
    },
    setSectionTitle(state,{payload}){
      const{index,message} = payload
      state.survey.survey.sections[index].title= message
    },
    setOptionsLabel(state,{payload}){
      const{secIndex,questIndex,valIndex} = payload
      //@ts-ignore
      state.survey.survey.sections[secIndex].questions[questIndex].values[valIndex].label = payload?.message
    },
    setAdultStatus(state,{payload}){
      const{secIndex,message} = payload
      //@ts-ignore
      state.survey.survey.sections[secIndex].conditions[0].adult_status = message
    },
    setGenderStatus(state,{payload}){
      const{secIndex,message} = payload
      //@ts-ignore
      state.survey.survey.sections[secIndex].conditions[0].gender_status = message
    },
    setOptionsOption(state,{payload}){
      const{secIndex,questIndex,valIndex} = payload
      //@ts-ignore
      state.survey.survey.sections[secIndex].questions[questIndex].values[valIndex].option = payload?.message
    },
    removeSection(state, { payload }) {
      const index = payload;
      state.survey.survey.sections.splice(index, 1);
      
    },
    removeSectionByTitle(state, { payload }) {
      const title = payload;
      state.survey.survey.sections = state.survey.survey.sections.filter((tit)=>(tit.title!=title));
      
    },
    removeOption(state, { payload }) {
      const {questIndex,secIndex,valIndex} = payload;
      state.survey.survey.sections[secIndex].questions[questIndex].values.splice(valIndex, 1);
      
    },
    removeQuestion(state, { payload }) {
      const {questIndex,secIndex} = payload;
      state.survey.survey.sections[secIndex].questions.splice(questIndex, 1);
      state.survey.survey.sections[secIndex].questions = state.survey.survey.sections?.[secIndex].questions.map((obj,index)=>({...obj,id:(index+1).toString()}))
    },
    setPreviosPath(state,{payload}){
      if(state.prevPath?.length && state?.prevPath[state?.prevPath?.length - 1]===payload){
        
      }
      else if(state.prevPath?.length){
        state.prevPath = [...state.prevPath,payload]
      }
      else{
        state.prevPath = [payload]
      }
    },
    clearLastPath(state){
     state.prevPath.pop()
    },

    setSectionAndQuestionNum(state,{payload}){
      state.errorSection = payload?.secNum
      state.errorQuestion = payload?.quesNum
    },
    setOptionNum(state,{payload}){
      state.errorSectionOpt = payload?.secNum
      state.errorQuestionOpt = payload?.quesNum
      state.errorOption = payload?.OptNum
    },
    setLabelNum(state,{payload}){
      state.errorSectionLab = payload?.secNum
      state.errorQuestionLab = payload?.quesNum
      state.errorLabel = payload?.LabNum
    },
    setSubmitClick(state,{payload}){
      state.submitClick = payload?.secNum
    },
    setSurveyType(state,{payload}){
      state.survey.survey.type=payload
    },
    setSurveyDetails(state,{payload}){
      state.survey.survey.details=payload
    },
    setDefaultSections(state,{payload}){
      state.defaultSections = payload
    },
    setLoggedInUser(state,{payload}){
      state.loginInfo = payload
      
    },
    setLoggedInRole(state,{payload}){
      state.roleinfo = payload
    },
    refreshAutoComplete(state,{payload}){
      state.autocompleteRefresh = payload
    },
    setnewSections(state,{payload}){
      state.survey.survey.sections = payload
    },
    setRecipeDetails(state,{payload}){
      state.recipeDetails = payload
    },
    setRecipeFoodName(state,{payload}){
      state.recipeDetails!.foodName=payload
    },
    InsertFoodImageObj(state,{payload}){
      state.recipeDetails={...state.recipeDetails,...payload}
    },
    setRecipeFoodImage(state,{payload}){
      state.recipeDetails!.foodImage!.displayImage=payload
    },
    setIngredientId(state,{payload}){
      state.recipeDetails!.Ingredients![payload.index]!.ingredientName=payload.value
    },
    setIngredientQuantity(state,{payload}){
      state.recipeDetails!.Ingredients![payload.index]!.quantity=payload.value
    },
    setNutrientId(state,{payload}){
      state.recipeDetails!.Nutrients![payload.index]!.nutrientName=payload.value
    },
    setNutrientValue(state,{payload}){
      state.recipeDetails!.Nutrients![payload.index]!.nutrientValue=payload.value
    },
    addNewIngredient(state){
        const object = {
          ingredientId:0,
          quantity:0
        }
          state.recipeDetails!.Ingredients = [
            ...state.recipeDetails!.Ingredients!,
            object
          ];
    },
    deleteIngredient(state,{payload}){
      let array=[...state.recipeDetails!.Ingredients!];
      array.splice(payload, 1);
      state.recipeDetails!.Ingredients =array;
    },
    addNewNutrient(state){
        const object = {
          nutrientId:0,
          nutrientValue:0
        }
          state.recipeDetails!.Nutrients = [
            ...state.recipeDetails!.Nutrients!,
            object
          ];
    },
    deleteNutrient(state,{payload}){
      let array=[...state.recipeDetails!.Nutrients!];
      array.splice(payload, 1);
      state.recipeDetails!.Nutrients =array;
    },
    setNext(state){
      state.survey.survey.sections.map((sects)=>({...sects,questions:
        sects?.questions?.map((ques,index)=>({...ques,values:
         ques?.values?.map((val,ind)=>({
            ...val,next:index+1===sects?.questions?.length ? null : index+2
         })) 
        }))
      }))
    },
    setCities(state,{payload}){
      state.cities = payload
    },
    setParticipantField(state,{payload}){
      if (state.houseHold?.participants?.length) {
        const newArray = [...state.houseHold?.participants];
        newArray[payload.memberIndex] = {...newArray?.[payload.memberIndex], [payload.field]:payload.value};
        state.houseHold.participants = newArray
    }
    },
    
    setComplete(state, action) {
      const payload = action.payload;
      const index = state!.complete!.findIndex(item => item?.member === payload?.member);

      if (index !== -1) {
        state!.complete![index] = payload;
      } else {
        state!.complete!.push(payload);
      }
    },
    removeCompleteByIndex(state, { payload }) {
      const index = payload;
      if (state!.complete?.length) {
      state!.complete = state!.complete?.filter((item,i)=> i !==index)
      
      }
    },
    setCompleteClear(state){
      state!.complete=[]
    },
    setParticipantData(state,{payload}){
      state.participantData=payload
    }
  },
  
});

export const {
  startLoading,
  stopLoading,
  hideAlert,
  showAlert,
  reload,
  setLoading,
  addFamilyMember,
  removeFamilyMember,
  updatDetails,
  addSection,
  setSurvey,
  removeSection,
  setQuestionTitle,
  addValues,
  addQuestion,
  setOptionsLabel,
  removeOption,
  removeQuestion,
  setOptionsOption,
  setSectionTitle,
  setPreviosPath,
  clearLastPath,
  setIsFirstTime,
  setResponseSurvey,
  // removeAllFamilyMembers,
  setSection,
  setSurveyClick,
  setSectionNumber,
  setSectionAndQuestionNum,
  setSubmitClick,
  setOptionNum,
  setLabelNum,
  resetHouseHolds,
  updateHouseHoldObj,
  setHouseHold,
  setRefreshForViewHouseHolds,
  setParticipant,
  setAccessToken,
  setApiErrorStatusCode,
  setSurveyType,
  setSurveyDetails,
  removeSectionByTitle,
  setDefaultSections,
  setViewSection,
  setLoggedInUser,
  setLoggedInRole,
  refreshAutoComplete,
  setnewSections,
  setRecipeDetails,
  setTypes,
  setRecipeFoodName,
  setRecipeFoodImage,
  InsertFoodImageObj,
  setIngredientId,
  setIngredientQuantity,
  setNutrientId,
  setNutrientValue,
  addNewIngredient,
  deleteIngredient,
  addNewNutrient,
  deleteNutrient,
  setAdultStatus,
  setGenderStatus,
  setNext,
  setCities,
  setParticipantField,
  setComplete,
  setCompleteClear,
  removeCompleteByIndex,
  setParticipantData
} = AppSlice.actions;
export default AppSlice.reducer;

import { Box, Button, Modal, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  refreshAutoComplete,
  removeOption,
  removeQuestion,
  removeSection,
  setSectionNumber,
} from "../../store/slices/app.tsx";
import { useDispatch, useSelector } from "react-redux";

const Modall = (props) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const closeModal = () => {
    setOpen(false);
    props?.handleClose();
  };

  useEffect(() => {
    if (props?.open !== open) {
      setOpen(props?.open);
    }
  }, [props?.open]);

  const appState = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const handleYes = () => {
    if (props?.type === "Section") {
    
      dispatch(setSectionNumber(appState?.sectionNum - 1));
      dispatch(removeSection(props?.ind[0]));
      dispatch(
        refreshAutoComplete(
          appState?.autocompleteRefresh === false ? true : false
        )
      );
      //   };
    } else if (props?.type === "Options") {
      dispatch(
        removeOption({
          secIndex: props?.ind[0],
          questIndex: props?.ind[1],
          valIndex: props?.ind[2],
        })
      );
    } else {
      dispatch(
        removeQuestion({
          secIndex: props?.ind[0],
          questIndex: props?.ind[1],
        })
      );
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div dir={lang === "ar" ? "rtl" : ""}>
            <Typography textAlign={"center"}>
              {t(`Are you sure to delete this ${props?.type}?`)}
            </Typography>
            <Box display={"flex"} justifyContent={"space-around"} mt={3}>
              <Button
                variant="contained"
                style={{ color: "white" }}
                onClick={() => {
                  closeModal();
                }}
              >
                {t("No")}
              </Button>
              <Button
                variant="contained"
                style={{ color: "white" }}
                onClick={() => {
                  handleYes();
                  closeModal();
                }}
              >
                {t("Yes")}
              </Button>
            </Box>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Modall;

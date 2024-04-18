import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Select as BaseSelect } from "@mui/base/Select";
import { Option as BaseOption, optionClasses } from "@mui/base/Option";
import { styled } from "@mui/system";
import { Popper as BasePopper } from "@mui/base/Popper";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import { numberWithCommas, fromWei } from "@utils/utils";

export default function UnstyledSelectRichOptions({
  options,
  tokenReserve,
  ethReserve,
  onChange,
}) {
  const bonds = useMemo(() => {
    return options?.filter((v) => !v.isClosed && parseInt(v.stakeTime) === 0);
  }, [options]);

  return (
    <Select placeholder="Select Bond" onChange={onChange}>
      {bonds?.length === 0 ? (
        <Option className="text-lg" value={-1} disabled>You do not have any active bonds.</Option>
      ) : (
        options?.map((v, i) => {
          if (!v.isClosed && parseInt(v.stakeTime) === 0) {
            return (
              <Option key={i} value={i}>
                <div className="flex gap-2">
                  <img src="assets/sam.png" alt="sam" width="30" height="30" />
                  <span>
                    {numberWithCommas(
                      (((fromWei(v?.amount) *
                        (100 + parseInt(v?.profitPercent) / 100)) /
                        100) *
                        tokenReserve) /
                        ethReserve
                    )}{" "}
                    SAM
                  </span>
                </div>
              </Option>
            );
          } else {
            return undefined;
          }
        })
      )}
    </Select>
  );
}

const Select = React.forwardRef(function CustomSelect(props, ref) {
  const slots = {
    root: Button,
    listbox: Listbox,
    popper: Popper,
    ...props.slots,
  };

  return <BaseSelect {...props} ref={ref} slots={slots} />;
});

Select.propTypes = {
  /**
   * The components used for each slot inside the Select.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  slots: PropTypes.shape({
    listbox: PropTypes.elementType,
    popper: PropTypes.func,
    root: PropTypes.elementType,
  }),
};

const blue = {
  100: "#DAECFF",
  200: "#99CCF3",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Button = React.forwardRef(function Button(props, ref) {
  const { ownerState, ...other } = props;
  return (
    <StyledButton type="button" {...other} ref={ref}>
      {other.children}
      <UnfoldMoreRoundedIcon />
    </StyledButton>
  );
});

Button.propTypes = {
  children: PropTypes.node,
  ownerState: PropTypes.object.isRequired,
};

const StyledButton = styled("button", { shouldForwardProp: () => true })(
  ({ theme }) => `
  font-size: 1.5rem;
  font-weight: 600;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px 12px;
  text-align: left;
  line-height: 1.5;
  background: ${document.body.className === "dark" ? "#0B122C" : "#FFF7E7"};
  border: 1px solid ${
    document.body.className === "dark" ? "#0d183f33" : "#af0cf233"
  };
  color: ${document.body.className === "dark" ? grey[300] : grey[900]};
  position: relative;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  & > svg {
    font-size: 2rem;
    position: absolute;
    height: 100%;
    top: 0;
    right: 10px;
  }
  `
);

const Listbox = styled("ul")(
  ({ theme }) => `
  font-size: 20px;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  width: 100%;
  min-width: 180px;
  max-height: 300px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${document.body.className === "dark" ? '#0B122C' : '#FFF7E7'};
  border: 1px solid ${
    document.body.className === "dark" ? grey[700] : grey[200]
  };
  color: ${document.body.className === "dark" ? grey[300] : grey[900]};
  box-shadow: 0px 2px 6px ${
    document.body.className === "dark"
      ? "rgba(0,0,0, 0.50)"
      : "rgba(0,0,0, 0.05)"
  };
  `
);

const Option = styled(BaseOption)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: ${
      document.body.className === "dark" ? '#0B122C' : '#FFF7E7'
    };
    color: ${document.body.className === "dark" ? blue[100] : blue[900]};
  }

  &.${optionClasses.highlighted} {
    background-color: ${
      document.body.className === "dark" ? grey[800] : grey[100]
    };
    color: ${document.body.className === "dark" ? grey[300] : grey[900]};
  }

  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${
      document.body.className === "dark" ? blue[900] : blue[100]
    };
    color: ${document.body.className === "dark" ? blue[100] : blue[900]};
  }

  &.${optionClasses.disabled} {
    color: ${document.body.className === "dark" ? '#fff' : '#000'};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${
      document.body.className === "dark" ? grey[800] : grey[100]
    };
    color: ${document.body.className === "dark" ? grey[300] : grey[900]};
  }

  & img {
    margin-right: 10px;
  }
  `
);

const Popper = styled(BasePopper)`
  z-index: 51;
`;

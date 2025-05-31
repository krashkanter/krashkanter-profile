import * as React from "react";
import { Switch } from "radix-ui";
import "../../styles/switch.css";

interface SwitchUiProps {
  label: string;
}

const SwitchUi = React.forwardRef<HTMLFormElement, SwitchUiProps>(
  (props, ref) => {
    return (
      <form ref={ref}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            className="Label"
            htmlFor="airplane-mode"
            style={{ paddingRight: 15 }}
          >
            {props.label}
          </label>
          <Switch.Root className="SwitchRoot" id="airplane-mode">
            <Switch.Thumb className="SwitchThumb" />
          </Switch.Root>
        </div>
      </form>
    );
  },
);

SwitchUi.displayName = "SwitchUi";

export default SwitchUi;

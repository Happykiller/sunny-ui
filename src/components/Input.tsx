// src\components\Input.tsx
import React from 'react';
import { Trans } from 'react-i18next';
import {
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  TextFieldProps
} from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'onChange'> {
  label: React.ReactNode;
  tooltip?: React.ReactNode | string;
  regex?: string;
  entity: {
    value: string;
    valid: boolean;
  };
  onChange?: (entity: { value: string; valid: boolean }) => void;
  require?: boolean;
  virgin?: boolean;
  icons?: {
    visibility?: React.ReactNode;
    visibilityOff?: React.ReactNode;
    help?: React.ReactNode;
  };
}

export const Input: React.FC<InputProps> = ({
  label,
  tooltip,
  regex,
  entity,
  onChange,
  require = false,
  virgin: virginProp = false,
  type = 'text',
  icons = {},
  ...rest
}) => {
  const [state, setState] = React.useState(entity);
  const [passVisible, setPassVisible] = React.useState(false);
  const [virgin, setVirgin] = React.useState(virginProp);

  const isPassword = type === 'password';

  const fullLabel = React.useMemo(
    () => <>{label}{require ? '*' : ''}</>,
    [label, require]
  );

  const calcValid = (value: string): boolean => {
    if (require && value.length === 0) return false;
    if (regex && value.length !== 0) {
      const reg = new RegExp(regex, 'g');
      return reg.test(value);
    }
    return true;
  };

  const giveHelper = () => {
    if (!virgin && require && !state.valid) {
      return <Trans>common.field_incorrect</Trans>;
    }
    return null;
  };

  const getTooltipTitle = () => {
    if (typeof tooltip === 'string') return tooltip;
    if (
      React.isValidElement(tooltip) &&
      (tooltip.props as { i18nKey?: string })?.i18nKey
    ) {
      return (tooltip.props as { i18nKey: string }).i18nKey;
    }
    return '';
  };

  const renderTooltip = () => (
    tooltip ? (
      <Tooltip title={getTooltipTitle()}>
        <IconButton>{icons.help}</IconButton>
      </Tooltip>
    ) : null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setVirgin(false);
    const newValue = e.target.value;
    const isValid = calcValid(newValue);
    setState({ value: newValue, valid: isValid });
    onChange?.({ value: newValue, valid: isValid });
  };

  const renderPasswordAdornment = () => (
    <InputAdornment position="end">
      <IconButton onClick={() => setPassVisible(prev => !prev)}>
        {passVisible ? icons.visibilityOff : icons.visibility}
      </IconButton>
      {renderTooltip()}
    </InputAdornment>
  );

  const renderTextAdornment = () => (
    tooltip ? <InputAdornment position="end">{renderTooltip()}</InputAdornment> : undefined
  );

  return (
    <TextField
      {...rest}
      label={fullLabel}
      variant="standard"
      size="small"
      autoComplete="off"
      type={isPassword && !passVisible ? 'password' : type}
      error={!virgin && !state.valid}
      value={state.value}
      helperText={giveHelper()}
      onChange={handleChange}
      slotProps={{
        input: {
          endAdornment: isPassword ? renderPasswordAdornment() : renderTextAdornment(),
        } as any,
      }}
    />
  );
};
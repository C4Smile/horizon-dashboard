import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

/**
 *
 * @param {*} props hook props
 * @returns hook to control form
 */
export const useFormDialog = (props) => {
  const { initial, submit } = props;

  const { control, reset, getValues } = useForm();

  const [showDialog, setShowDialog] = useState(false);

  const open = () => setShowDialog(true);
  const onClose = () => setShowDialog(false);

  useEffect(() => {
    if (initial) reset({ ...initial });
    else reset();
  }, [initial, reset]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      submit(getValues());
      onClose();
    },
    [getValues, submit],
  );

  return {
    dialogProps: {
      show: showDialog,
      open,
      onClose,
    },
    control,
    onSubmit,
  };
};

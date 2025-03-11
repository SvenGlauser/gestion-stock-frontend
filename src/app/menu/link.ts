export interface Link {
  name: string;
  icon: string;
  url: string;
  activated?: boolean;
  disabled?: boolean;
  disabledLabel?: string;
  separatorBefore?: string;
}

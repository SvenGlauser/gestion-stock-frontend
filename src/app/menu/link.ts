export interface Link {
  name: string;
  icon: string;
  url: string;
  activated?: boolean;
  disabled?: boolean;
  onHomePage?: boolean;
  disabledLabel?: string;
  separatorBefore?: string;
  children?: Link[];
}

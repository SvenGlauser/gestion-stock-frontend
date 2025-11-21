export enum MenuLinkGroup {
  DEFAULT = 'DEFAULT',
  ACTIONS_PRINCIPALES = 'ACTIONS_PRINCIPALES',
  CONFIGURATION = 'CONFIGURATION',
  TECHNIQUE = 'TECHNIQUE',
}

export interface MenuLink {
  name: string;
  icon: string;
  url: string;
  activated?: boolean;
  disabled?: boolean;
  disabledLabel?: string;
  onHomePage?: boolean;
  group: MenuLinkGroup;
  order: number;
}

export const menuLinkGroupNameMapper: Map<MenuLinkGroup, string> = new Map([
  [MenuLinkGroup.DEFAULT,""],
  [MenuLinkGroup.ACTIONS_PRINCIPALES,"Actions principales"],
  [MenuLinkGroup.CONFIGURATION,"Configuration"],
  [MenuLinkGroup.TECHNIQUE,"Technique"],
]);

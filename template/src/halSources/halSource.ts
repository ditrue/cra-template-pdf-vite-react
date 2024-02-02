export type LinkProps = {
  href: string;
  [key: string]: any;
}

export type FormatTable = {
  format: 'markdown';
  raw: string;
  html: string;
}

export type HalSourceProps = {
  _type: string;
}

export class HalSource {
  type: string;

  constructor(props: HalSourceProps) {
    const { _type } = props;
    this.type = _type;
  }

  isValidLink(link?: LinkProps) {
    return !(!link || !link.href);
  }

  isValidV3Link(link?: LinkProps) {
    return !!link && !!link.href && /^\/api\/v3\//.test(link.href);
  }
}

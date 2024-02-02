import { FormatTable, LinkProps } from './halSource';
import { ProjectHalSource, ProjectHalSourceProps } from './projectHalSource';
import { SingleHalSource, SingleHalSourceProps } from './singleHalSource';
import { StatusHalSource, StatusHalSourceProps } from './statusHalSource';

export type WorkPackageLinks = {
  activities: LinkProps;
  addAttachment: LinkProps;
  addChild: LinkProps;
  addComment: LinkProps;
  addRelation: LinkProps;
  addWatcher: LinkProps;
  assignee: LinkProps;
  attachments: LinkProps;
  author: LinkProps;
  availableRelationCandidates: LinkProps;
  availableWatchers: LinkProps;
  category: LinkProps;
  changeParent: LinkProps;
  configureForm: LinkProps;
  copy: LinkProps;
  customActions: LinkProps[];
  customFields: LinkProps;
  delete: LinkProps;
  github_pull_requests: LinkProps;
  move: LinkProps;
  parent: LinkProps;
  pdf: LinkProps;
  previewMarkup: LinkProps;
  priority: LinkProps;
  project: LinkProps;
  relations: LinkProps;
  removeWatcher: LinkProps;
  responsible: LinkProps;
  revisions: LinkProps;
  schema: LinkProps;
  self: LinkProps;
  status: LinkProps;
  type: LinkProps;
  update: LinkProps;
  updateImmediately: LinkProps;
  version: LinkProps;
  watch: LinkProps;
  watchers: LinkProps;
}

export type WorkPackageProps = {
  id: number;
  lockVersion: number;
  subtitle: string;
  description: FormatTable;
  derivedStartDate?: string;
  derivedDueDate?: string;
  derivedEstimatedTime?: string;
  scheduleManually: boolean;
  startDate: string;
  dueDate: string;
  estimatedTime?: string;
  duration: string;
  ignoreNonWorkingDays: boolean;
  percentageDone: number;
  readonly: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WorkPackageHalSourceProps = SingleHalSourceProps<{
  _links: WorkPackageLinks;
  _embedded?: WorkPackageEmbedded;
} & WorkPackageProps>;

export type WorkPackageEmbedded = {
  project: ProjectHalSourceProps;
  status: StatusHalSourceProps
}

export class WorkPackageHalSource extends SingleHalSource<WorkPackageHalSourceProps> implements WorkPackageProps {
  links: WorkPackageLinks;
  project?: ProjectHalSource;
  status?: StatusHalSource;

  constructor(props: WorkPackageHalSourceProps) {
    super(props);
    const { _links, _embedded } = props;
    this.links = _links;

    if (_embedded?.project) {
      this.project = new ProjectHalSource(_embedded.project);
    }

    if (_embedded?.status) {
      this.status = new StatusHalSource(_embedded.status);
    }
  }

  get id() {
    return this.source.id;
  }

  get lockVersion() {
    return this.source.lockVersion;
  }

  get subtitle() {
    return this.source.subtitle;
  }

  get description() {
    return this.source.description;
  }

  get derivedStartDate() {
    return this.source.derivedStartDate;
  }

  get derivedDueDate() {
    return this.source.derivedDueDate;
  }

  get derivedEstimatedTime() {
    return this.source.derivedEstimatedTime;
  }

  get scheduleManually() {
    return this.source.scheduleManually;
  }

  get startDate() {
    return this.source.startDate;
  }

  get dueDate() {
    return this.source.dueDate;
  }

  get estimatedTime() {
    return this.source.estimatedTime;
  }

  get duration() {
    return this.source.duration;
  }

  get ignoreNonWorkingDays() {
    return this.source.ignoreNonWorkingDays;
  }

  get percentageDone() {
    return this.source.percentageDone;
  }

  get readonly() {
    return this.source.readonly;
  }

  get createdAt() {
    return this.source.createdAt;
  }

  get updatedAt() {
    return this.source.updatedAt;
  }

  get statusId() {
    const id = this.links.status?.href?.match(/^\/api\/v3\/statuses\/(\d+)/)?.[1];
    if (!id) return null;
    return Number(id);
  }

  get statusName() {
    return this.links.status?.title;
  }

  get typeId() {
    const id = this.links.type?.href?.match(/^\/api\/v3\/types\/(\d+)/)?.[1];
    if (!id) return null;
    return Number(id);
  }

  get typeName() {
    return this.links.type?.title;
  }
}

import { ActivityHalSource, ActivityHalSourceProps } from './activityHalSource';
import { LinkProps } from './halSource';
import { ProjectHalSource, ProjectHalSourceProps } from './projectHalSource';
import { SingleHalSource, SingleHalSourceProps } from './singleHalSource';
import { UserHalSource, UserHalSourceProps } from './userHalSource';
import { WorkPackageHalSource, WorkPackageHalSourceProps } from './workPackageHalSource';

export type NotificationLinks = {
  activity: LinkProps;
  actor: LinkProps;
  project: LinkProps;
  readIAN: LinkProps;
  resource: LinkProps;
  self: LinkProps;
}

export type NotificationProps = {
  id: number;
  readIAN: false,
  reason: string;
  reasonName: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationEmbedded = {
  activity: ActivityHalSourceProps;
  actor: UserHalSourceProps;
  project: ProjectHalSourceProps;
  resource: WorkPackageHalSourceProps;
}

export type NotificationHalSourceProps = SingleHalSourceProps<{
  _links: NotificationLinks;
  _embedded?: NotificationEmbedded;
} & NotificationProps>

export class NotificationHalSource extends SingleHalSource<NotificationHalSourceProps> implements NotificationProps {
  links: NotificationLinks;
  project?: ProjectHalSource;
  activity?: ActivityHalSource;
  actor?: UserHalSource;
  workPackage?: WorkPackageHalSource;

  constructor(props: NotificationHalSourceProps) {
    super(props);
    const { _links, _embedded } = props;
    this.links = _links;

    if (_embedded?.project) {
      this.project = new ProjectHalSource(_embedded.project);
    }

    if (_embedded?.activity) {
      this.activity = new ActivityHalSource(_embedded.activity);
    }

    if (_embedded?.actor) {
      this.actor = new UserHalSource(_embedded.actor);
    }

    if (_embedded?.resource && _embedded.resource._type === 'WorkPackage') {
      this.workPackage = new WorkPackageHalSource(_embedded.resource);
    }
  }

  get id() {
    return this.source.id;
  }

  get readIAN() {
    return this.source.readIAN;
  }

  get reason() {
    return this.source.reason;
  }

  get reasonName() {
    return this.source.reasonName;
  }

  get createdAt() {
    return this.source.createdAt;
  }

  get updatedAt() {
    return this.source.updatedAt;
  }

  get projectId() {
    const id = this.links.project?.href?.match(/^\/api\/v3\/projects\/(\d+)/)?.[1];
    if (!id) return null;
    return Number(id);
  }

  get projectName(): string {
    return this.links.project?.title;
  }

  get wpId() {
    const id = this.links.resource?.href?.match(/^\/api\/v3\/work_packages\/(\d+)/)?.[1];
    if (!id) return null;
    return Number(id);
  }

  get wpName(): string | null {
    if (!this.links.resource?.href || !/^\/api\/v3\/work_packages\/(\d+)/.test(this.links.resource.href)) return null;
    return this.links.resource?.title;
  }

  get actorId() {
    const id = this.links.actor?.href?.match(/^\/api\/v3\/users\/(\d+)/)?.[1];
    if (!id) return null;
    return Number(id);
  }

  get actorName() {
    return this.links.actor?.title;
  }
}

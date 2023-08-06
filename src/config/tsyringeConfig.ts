import { container } from 'tsyringe';
import { GroupService } from '@/services/GroupService';
import { UserCharacterGroupService } from '@/services/UserCharacterGroupService';

container.register(GroupService, { useClass: GroupService });
container.register(UserCharacterGroupService, {
  useClass: UserCharacterGroupService,
});

export { container };

export class MessageHandler {
  private static messages: { [key: string]: { [key: string]: string } } = {
    en: {
      'user.email.exists': 'Email already exists.',
      'user.register.success': 'User registered successfully.',
      'user.email.password.invalid': 'Invalid email or password',
      'user.unauthorized': 'User unauthorized',
      'user.banned': 'User banned until {param}',
      'invalid.token': 'Invalid token',
      'user.not.found': 'User not found',
      'user.name.updated': 'User name updated successfully',
      'user.password.invalid': 'Invalid current password',
      'user.password.updated': 'User password updated successfully',
      'user.character.max.amount': 'Maximum number of characters reached',
      'user.character.success': 'Character created successfully',
      'user.character.not.found': 'Character not found',
      'user.character.min.level':
        'Character cannot be deleted, character of {param} level or higher cannot be deleted',
      'user.character.inactivated': 'Character deleted successfully',
      'user.character.name.exists': 'Character name already exists',
      'upload.is.multipart':
        'Invalid request: Multipart form-data is expected.',
      'upload.no.file': 'No files found in the request.',
      'upload.is.image.valid':
        'Invalid file format. Only JPG and PNG files are allowed.',
      'upload.size.max.file':
        'Invalid file size. Maximum up to 500 KB allowed.',
      'upload.file.not.found': 'Upload file not found.',
      'user.character.image.updated': 'Character image updated successfully',
      'user.character.name.time':
        'You cannot change the name now, wait until {param}',
      'user.character.name.updated': 'Character name updated successfully',
      'group.name.exists': 'Group name already exists, try another name',
      'group.tag.exists': 'Group tag already exists, try another tag',
      'group.success': 'Group created successfully',
      'session.unauthorized': 'Session unauthorized',
      'invite.group.exists':
        'An invitation request already exists for this group',
      'invite.group.success':
        'Group invitation request successfully, wait for a leader or captain to accept you',
      'group.not.found': 'Group not found',
      'group.character.already.exists': 'You are already active in a group',
      'invite.group.not.found': 'Group invite request not found',
      'invite.group.accept.success':
        'Group invitation request successfully accepted',
      'invite.group.decline.success':
        'Group invite request successfully declined',
      'character.not.found': 'Character not found',
      'user.character.insufficient.points': 'Insufficient distribute points',
      'user.character.points.success': 'Points distributed successfully',
      'item.not.found': 'Item not found',
      'user.character.item.max.amount': 'Maximum amount of character items hit',
      'user.character.item.not.found': 'Character item not found',
    },
    pt: {
      'user.email.exists': 'Já existe o email cadastrado.',
      'user.register.success': 'Usuário cadastrado com sucesso.',
      'user.email.password.invalid': 'E-mail ou senha inválida',
      'user.unauthorized': 'Usuário não autorizado',
      'user.banned': 'Usuário banido até {param}',
      'invalid.token': 'Token inválido',
      'user.not.found': 'Usuário não encontrado',
      'user.name.updated': 'Nome do usuário atualizado com sucesso',
      'user.password.invalid': 'Senha atual inválida',
      'user.password.updated': 'Senha do usuário atualizada com sucesso',
      'user.character.max.amount': 'Quantidade máxima de personagens atingido',
      'user.character.success': 'Personagem criado com sucesso',
      'user.character.not.found': 'Personagem não encontrado',
      'user.character.min.level':
        'Personagem não pode ser excluído, personagem de nível {param} ou mais não podem ser excluídos',
      'user.character.inactivated': 'Personagem excluído com sucesso',
      'user.character.name.exists': 'Nome do personagem já existe',
      'upload.is.multipart':
        'Solicitação inválida: Multipart form-data é esperado.',
      'upload.no.file': 'Nenhum arquivo encontrado na solicitação.',
      'upload.is.image.valid':
        'Formato de arquivo inválido. Somente arquivos JPG e PNG são permitidos.',
      'upload.size.max.file':
        'Tamanho de arquivo inválido. Máximo de até 500 KB permitido.',
      'upload.file.not.found': 'Arquivo do upload não encontrado.',
      'user.character.image.updated':
        'Imagem do personagem atualizada com sucesso',
      'user.character.name.time':
        'Você não pode alterar o nome agora, espere até {param}',
      'user.character.name.updated':
        'Nome do personagem atualizado com sucesso',
      'group.name.exists': 'O nome do grupo já existe, tente outro nome',
      'group.tag.exists': 'A tag do grupo já existe, tente outra tag',
      'group.success': 'Grupo criado com sucesso',
      'session.unauthorized': 'Sessão não autorizada',
      'invite.group.exists':
        'Já existe uma solicitação de convite para este grupo',
      'invite.group.success':
        'Solicitação de convite ao grupo com sucesso, aguarde um líder ou capitão te aceitar',
      'group.not.found': 'Grupo não encontrado',
      'group.character.already.exists': 'Você já está ativo em um grupo',
      'invite.group.not.found':
        'Solicitação de convite de grupo não encontrado',
      'invite.group.accept.success':
        'Solicitação de convite de grupo aceito com sucesso',
      'invite.group.decline.success':
        'Solicitação de convite de grupo recusado com sucesso',
      'character.not.found': 'Personagem não encontrado',
      'user.character.insufficient.points': 'Pontos de distribuir insuficiente',
      'user.character.points.success': 'Pontos distribuídos com sucesso',
      'item.not.found': 'Item não encontrado',
      'user.character.item.max.amount':
        'Quantidade máxima de itens do personagem atingido',
      'user.character.item.not.found': 'Item do personagem não encontrado',
    },
  };

  static getMessage(
    key: string,
    lang: string,
    param?: string
  ): string | undefined {
    const primaryLang = lang.split('-')[0].toLowerCase();
    const availableLanguages = Object.keys(this.messages);
    const selectedLang = availableLanguages.includes(primaryLang)
      ? primaryLang
      : 'en';
    let message = this.messages[selectedLang]?.[key] || key;
    if (param) {
      message = message.replace('{param}', param);
    }
    return message;
  }
}

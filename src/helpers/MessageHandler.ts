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
      'user.character.inactivated': 'Character deleted successfully',
      'user.character.name.exists': 'Character name already exists',
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
      'user.character.inactivated': 'Personagem excluído com sucesso',
      'user.character.name.exists': 'Nome do personagem já existe',
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

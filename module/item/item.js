/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class SvnSea2EItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */

  chatTemplate = {
    "advantage": 'systems/svnsea2e/templates/items/parts/skill-throw.hbs',
    "background": 'systems/svnsea2e/templates/items/parts/skill-throw-background.hbs',
    "sorcery": 'systems/svnsea2e/templates/items/parts/skill-throw.hbs',
    "secretsociety": 'systems/svnsea2e/templates/items/parts/skill-throw.hbs',
    "story": 'systems/svnsea2e/templates/items/parts/skill-throw.hbs',  
    "duelstyle": 'systems/svnsea2e/templates/items/parts/skill-throw.hbs',
    "artifact": 'systems/svnsea2e/templates/items/parts/skill-throw.hbs',
    "virtue": 'systems/svnsea2e/templates/items/parts/skill-throw.hbs',
    "hubris": 'systems/svnsea2e/templates/items/parts/skill-throw.hbs',  
    }
  


  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.system;

    if (this.type === 'scheme') {
      this._prepareSchemeData(itemData);
    } else if (itemData.type === 'advantage') {
      this._prepareAdvantageData(itemData);
    }
  }

  /**
   * Prepare an object of chat data used to display a card for the Item in the chat log
   * @param {Object} htmlOptions    Options used by the TextEditor.enrichHTML function
   * @return {Object}               An object of chat data to render
   */
  async getChatData(htmlOptions) {
    const data = duplicate(this.system);

    // Rich text description
    data.metadatahtml = '';
    data.description = await TextEditor.enrichHTML(data.description, {
      htmlOptions,
      async: true,
    });
    const fn = this[`_${this.type}ChatData`];
    if (fn) fn.bind(this)(data, htmlOptions);

    return data;
  }

  /**
   * Prepare chat data for an advantage
   * @param {Object} data    Options used by the TextEditor.enrichHTML function
   * @return {Object}               An object of chat data to render
   */
  _advantageChatData(data, htmlOptions) {
    const pts =
      data.cost.normal === 1
        ? game.i18n.localize('SVNSEA2E.Point')
        : game.i18n.localize('SVNSEA2E.Points');
    data.metadatahtml = `<ul class="details-list"><li class="tag">${data.cost.normal} ${pts}</li>`;
    data.metadatahtml += data.cost.specreq
      ? '<li class="tag">' + data.cost.specreq + '</li>'
      : '';
    data.metadatahtml += data.knack
      ? '<li class="tag">' + game.i18n.localize('SVNSEA2E.Knack') + '</li>'
      : '';
    data.metadatahtml += data.innate
      ? '<li class="tag">' + game.i18n.localize('SVNSEA2E.Innate') + '</li>'
      : '';
    data.metadatahtml += '</ul>';

    return data;
  }

  _artifactChatData(data, htmlOptions) {
    const type =
      data.type === 'none' ? '' : CONFIG.SVNSEA2E.artifactTypes[data.type];
    data.metadatahtml = `<ul class="details-list"><li class="tag">${type}</li></ul>`;
    return data;
  }

  _backgroundChatData(data, htmlOptions) {
    let skillNames = '';
    data.skills.forEach(
      (skl) =>
        (skillNames += `<li class="tag">${CONFIG.SVNSEA2E.skills[skl]}</li>`),
    );

    let advNames = '';
    for (let i = 0; i < data.advantages.length; i++) {
      advNames += `<li class="tag">${data.advantages[i]}</li>`;
    }

    data.metadatahtml = `<h5>${game.i18n.localize('SVNSEA2E.Quirk')}</h5>
    <p>${data.quirk}</p>
    <h5>${game.i18n.localize('SVNSEA2E.Skills')}</h5>
    <ul class="skills-list">
    ${skillNames}
    </ul>
    <h5>${game.i18n.localize('SVNSEA2E.Advantages')}</h5>
    <ul class="advantages-list">
    ${advNames}
    </ul>
`;
    return data;
  }

  _duelstyleChatData(data, htmlOptions) {
    data.metadatahtml = `
    <h5>${game.i18n.format('SVNSEA2E.Bonus')}</h5>
    <p>${data.bonus}</p>
      `;
    return data;
  }

  _schemeChatData(data, htmlOptions) {
    data.metadatahtml =
      '<p>' +
      game.i18n.format('SVNSEA2E.ChatInfluence', {
        influence: data.influence.toString(),
      }) +
      '</p>';
    return data;
  }

  _secretsocietyChatData(data, htmlOptions) {
    data.metadatahtml = `
    <h5>${game.i18n.localize('SVNSEA2E.Concern')}</h5>
    <p>${data.concern}</p>
    <h5>${game.i18n.localize('SVNSEA2E.EarnFavor')}</h5>
    <p>${data.earnfavor}</p>
    <h5>${game.i18n.localize('SVNSEA2E.UseFavor')}</h5>
    <p>${data.callupon}</p>
`;
    return data;
  }

  _sorceryChatData(data, htmlOptions) {
    data.metadatahtml = `
    <ul class="tag-list">
    <li class="tag">${CONFIG.SVNSEA2E.sorceryTypes[data.sorctype]}</li>
    <li class="tag">${CONFIG.SVNSEA2E.sorcerySubcats[data.sorcsubcat]} ${
      CONFIG.SVNSEA2E.sorceryCats[data.sorccat]
    }</li>
    <li class="tag">${game.i18n.localize('SVNSEA2E.Duration')}: ${
      CONFIG.SVNSEA2E.durations[data.sorcdur]
    }</li>
    </ul>
`;
    return data;
  }

  _storyChatData(data, htmlOptions) {
    data.metadatahtml = `
    <h5>${game.i18n.localize('SVNSEA2E.Status')}</h5>
    <p>${CONFIG.SVNSEA2E.storyStatuses[data.status]}</p>
    <h5>${game.i18n.localize('SVNSEA2E.Endings')}</h5>
    <p>${data.endings}</p>
    <h5>${game.i18n.localize('SVNSEA2E.Steps')}</h5>
    <p>${data.steps}</p>
    <h5>${game.i18n.localize('SVNSEA2E.Reward')}</h5>
    <p>${data.reward}</p>
`;
    return data;
  }

  _validateMinMaxData(value, min, max) {
    if (value > max) {
      return max;
    } else if (value < min) {
      return min;
    }
    return value;
  }

  /**
   * Prepare advantage type specific data
   */
  _prepareAdvantageData(data) {
    data.cost.norm = this._validateMinMaxData(
      data.cost.norm,
      data.cost.min,
      data.cost.max,
    );
  }

  /**
   * Prepare scheme type specific data
   */
  _prepareSchemeData(data) {
    data.influence.value = this._validateMinMaxData(
      data.influence.value,
      data.influence.min,
      data.influence.max,
    );
  }


  async ItemThrow(event) {   
    const element = this;
    const system = element.system;

    // Datos del mensaje de chat
    let chatData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        /*buttons: {
            button1: {
                label: "Button #1",
                callback: () => { ui.notifications.info("Button #1 Clicked!"); },
                icon: `<i class="fas fa-check"></i>`
            }
        }*/
    };

    // Datos de la tarjeta
    let cardData = {
        ...element, // Si estás utilizando datos específicos del sistema, mejor usa 'system' en lugar de 'this.system'
        owner: this.actor.id
    };
    
    // Renderizar la plantilla y asignarla al contenido del chat
    chatData.content = await renderTemplate(this.chatTemplate[element.type], cardData);

    // Indicar que se trata de una tirada
    chatData.roll = true;

    // Crear el mensaje de chat
    return ChatMessage.create(chatData);
}
}

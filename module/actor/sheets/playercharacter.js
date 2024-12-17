import ActorSheetSS2e from './base.js';
import { getItems, skillsToSheetData } from '../../helpers.js';
import { roll } from '../../roll/roll.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @ext'../../dice.js't}
 */
export class ActorSheetSS2ePlayerCharacter extends ActorSheetSS2e {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['svnsea2e', 'sheet', 'actor', 'pc'],
      template: 'systems/svnsea2e/templates/actors/playercharacter.html',
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'traits',
        },
      ],
    });
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(data, sheetData) {
    // const actorData = actor.system;
    // console.log('actorData', actorData);
    // console.log('actor', actor);
    // Assign and return
    sheetData.skills = skillsToSheetData(data.document.system, CONFIG);
    sheetData.advantages = getItems(data, 'advantage');
    sheetData.backgrounds = getItems(data, 'background');
    sheetData.sorcery = getItems(data, 'sorcery');
    sheetData.secretsocieties = getItems(data, 'secretsociety');
    sheetData.stories = getItems(data, 'story');
    sheetData.duelstyles = getItems(data, 'duelstyle');
    sheetData.artifacts = getItems(data, 'artifact');
    sheetData.virtues = getItems(data, 'virtue');
    sheetData.hubriss = getItems(data, 'hubris');
  }

  
  activateListeners(html) {
    super.activateListeners(html);
    html.find('.item-throw').click(this._onItemThrow.bind(this));
    html.find('.roll-throw').click(this._onRollThrow.bind(this));
  }

  _onItemThrow(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    console.log(itemId);
    const item = this.actor.items.get(itemId);
    console.log(item);
    item.ItemThrow();
  }

  async _onRollThrow(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actor = this.actor;
    const data = this.actor.system;

    // Ruta al archivo de plantilla de diálogo
    const template = "systems/svnsea2e/templates/items/parts/roll-throw.hbs";

    // Define los valores predeterminados del formulario
    const formDefaults = {
        trait: 0,
        flairDice: false,
        interpretationDice: false,
        useForMe: 0,
        useForHelpMe: 0,
        bonusDice: 0,
        increaseThreshold: false,
        addOneToDice: false,
        joieDeVivreAdvantage: false,
    };

    const initialBonusDice = data.dwounds.value >= 1 ? 1 : 0;

    const dialogData = {
        data: data,
        traitmax: data.traits.brawn.min,
        initialBonusDice,
    };

    // Renderizar el diálogo de forma asíncrona
    const htmlContent = await renderTemplate(template, dialogData);

    return new Promise((resolve) => {
        new Dialog({
            title: "Roll Dice",
            content: htmlContent,
            buttons: {
                roll: {
                    label: "Lanzar Dados",
                    callback: async (html) => {
                        // Obtener la cantidad de dados desde el input del diálogo
                        let numDados = parseInt(html.find("#dice-number").val(), 10);

                        // Validar que numDados sea un número; en caso contrario, asignar 0 como valor predeterminado
                        if (isNaN(numDados)) numDados = 0;

                        // Llamar a la función roll de manera asíncrona
                        await roll({
                            rolldata: {
                                skilldice: numDados, // Pasa la cantidad de dados en `skilldice`
                                threshold: 10,       // Ejemplo de threshold, ajústalo según necesites
                                explode: false,      // Ejemplo, puedes ajustarlo según tu sistema
                                reroll: false,
                            },
                            actor: actor,
                            data: data,
                            form: { ...formDefaults, trait: { value: 0 } }, // Pasa los valores predeterminados y el trait
                            template: 'systems/svnsea2e/templates/chats/roll-card.html', // Ruta al template del chat
                            title: "Resultado de Lanzamiento de Dados",
                        });
                        resolve(); // Resolver la promesa cuando termine la ejecución
                    },
                },
                cancel: {
                    label: "Cancelar",
                    callback: () => resolve(), // Resolver la promesa en caso de cancelar
                },
            },
            default: "roll",
        }).render(true);
    });
}


  /* -------------------------------------------- */
}

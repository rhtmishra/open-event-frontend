import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class NewSessionRoute extends Route {
  titleToken() {
    return this.l10n.t('New Session');
  }

  async model() {
    const eventDetails = this.modelFor('public');
    const speakers = await eventDetails.query('speakers', {
      filter: [
        {
          name : 'email',
          op   : 'eq',
          val  : this.authManager.currentUser.email
        }
      ]
    });
    const sessionDetails = await this.store.createRecord('session', {
      event       : eventDetails,
      creator     : this.authManager.currentUser,
      track       : null,
      sessionType : null,
      speakers
    });
    return {
      event : eventDetails,
      forms : await eventDetails.query('customForms', {
        sort         : 'id',
        'page[size]' : 0
      }),
      session      : sessionDetails,
      speaker      : speakers,
      tracks       : await eventDetails.query('tracks', {}),
      sessionTypes : await eventDetails.query('sessionTypes', {})
    };
  }

  resetController(controller) {
    super.resetController(...arguments);
    const model = controller.model.session;
    if (!model.id) {
      controller.model.session.unloadRecord();
    }
  }
}

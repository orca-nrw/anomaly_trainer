"use strict";

/**
 * @overview <i>ccmjs</i>-based web component for Anomaly Trainer.
 * @author André Kless <andre.kless@web.de> 2022-2023
 * @license The MIT License (MIT)
 * @copyright EILD.nrw 2022
 * @version latest (1.0.0)
 */

( () => {

  /**
   * <i>ccmjs</i>-based web component for Anomaly Trainer.
   * @namespace WebComponent
   * @type {object}
   * @property {string} name - Unique identifier of the component.
   * @property {number[]} [version] - Version of the component according to Semantic Versioning 2.0 (default: latest version).
   * @property {string} ccm - URL of the (interchangeable) ccmjs version used at the time of publication.
   * @property {app_config} config - Default app configuration.
   * @property {Class} Instance - Class from which app instances are created.
   */
  const component = {
    name: 'anomaly_trainer',
    ccm: './libs/ccm/ccm.js',
    config: {

      // General Configurations and Dependencies
      "css": [ "ccm.load",
        [  // is loaded serially (not in parallel)
          "./libs/bootstrap-5/css/bootstrap.css",
          "./resources/styles.css",
        ],
        { "url": "./libs/bootstrap-5/css/bootstrap-fonts.css", "context": "head" }
      ],
      "helper": [ "ccm.load", { "url": "./libs/ccm/helper.js", "type": "module" } ],
      "html": [ "ccm.load", { "url": "./resources/templates.js", "type": "module" } ],
      // "logos": "./resources/img/logos/logos.jpg",
      // "onchange": event => console.log( event ),
      "onfinish": { "log": true, "restart": true },
      // "onready": event => console.log( event ),
      // "onstart": event => console.log( event ),
      "toposort": [ "ccm.load", { "url": "./libs/toposort/toposort.js#toposort", "type": "module" } ],

      // Trainer-specific Configurations
      "cols": [ "", "T1", "T2", "A", "a1", "a2", "B", "b1", "b2" ],
      "ops": {
        "read0": "read({A},{a})",
        "read1": "read({A},{a})",
        "add_x": "{a} = {a} + {x}",
        "write": "write({A},{a})",
        "rollb": "rollback"
      },

      /*
      "schedules": [
        {
          "a": 32,
          "b": 58,
          "steps": [ "T1,read1", "T1,add_x", "T2,read1", "T2,add_x", "T2,write", "T1,write" ],
          "t1": { "attr": "a", "summand": 4 },
          "t2": { "attr": "a", "summand": 5 },
          "inputs": [
            {
              "label": "Lost Update",
              "solution": true
            },
            {
              "label": "Non-Repeatable Read",
              "solution": true
            },
            {
              "label": "Dirty Read",
              "solution": true
            }
          ]
        }
      ],
      "schedules2": {
        "ops": [
          [ "read0", "read1", "add_x", "write" ], // T1
          [ "read1", "add_x", "write", "rollb" ]  // T2
        ],
        "rules": [
          [ "T1,read0", "T1,read1" ],
          [ "T1,read1", "T1,add_x" ],
          [ "T1,add_x", "T1,write" ],
          [ "T1,write", "T1,rollb" ],
          [ "T2,read0", "T2,read1" ],
          [ "T2,read1", "T2,add_x" ],
          [ "T2,add_x", "T2,write" ],
          [ "T2,write", "T2,rollb" ]
        ],
        "b": 10,
        "read0": 50,
        "rollb": 50,
        "match": 90,
        "value": [ 10, 80 ],
        "summand": [ 1, 9 ],
        "rounds": 10,
        "inputs": [
          {
            "label": "Lost Update",
            "solution": [
              [ "T1,read1", "T2,write" ],
              [ "T2,write", "T1,write" ]
            ]
          },
          {
            "label": "Non-Repeatable Read",
            "solution": [
              [ "T1,read0", "T2,write" ],
              [ "T2,write", "T1,read1" ]
            ]
          },
          {
            "label": "Dirty Read",
            "solution": [
              [ "T1,write", "T2,read1" ],
              [ "T2,read1", "T1,rollb" ]
            ]
          }
        ]
      },
       */

      "t_ops": null,
      "random": {
        "b": 10,
        "read0": 50,
        "rollb": 50,
        "match": 90,
        "value": [ 10, 80 ],
        "summand": [ 1, 9 ]
      },
      "rounds": 10,

      "text": {
        "title": "Anomalie-Trainer",
        "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen eine Anomalie aufgetreten ist.",
        "yes": "Ja",
        "neither": "",
        "no": "Nein",
        "submit": "Abschicken",
        "next": "Nächste",
        "finish": "Neustart"
      },
      "topology": [
        [
          [ "T1,read0", "T1,read1" ],
          [ "T1,read1", "T1,add_x" ],
          [ "T1,add_x", "T1,write" ],
          [ "T1,write", "T1,rollb" ],
          [ "T2,read0", "T2,read1" ],
          [ "T2,read1", "T2,add_x" ],
          [ "T2,add_x", "T2,write" ],
          [ "T2,write", "T2,rollb" ]
        ],
        {
          "label": "Lost Update",
          "whitelists": [
            [
              [ "T1,read1", "T2,write" ],
              [ "T2,write", "T1,write" ]
            ],
            [
              [ "T2,read1", "T1,write" ],
              [ "T1,write", "T2,write" ]
            ]
          ]
        },
        {
          "label": "Non-Repeatable Read",
          "whitelists": [
            [
              [ "T1,read0", "T2,write" ],
              [ "T2,write", "T1,read1" ]
            ],
            [
              [ "T2,read0", "T1,write" ],
              [ "T1,write", "T2,read1" ]
            ]
          ]
        },
        {
          "label": "Dirty Read",
          "whitelists": [
            [
              [ "T1,write", "T2,read1" ],
              [ "T2,read1", "T1,rollb" ]
            ],
            [
              [ "T2,write", "T1,read1" ],
              [ "T1,read1", "T2,rollb" ]
            ]
          ]
        }
      ]
    },
    /**
     * @class
     * @memberOf WebComponent
     */
    Instance: function () {

      /**
       * Shortcut to helper functions
       * @private
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * App state data
       * @type {app_state}
       */
      let data;

      /**
       * When the instance is created, when all dependencies have been resolved and before the dependent sub-instances are initialized and ready. Allows dynamic post-configuration of the instance.
       * @async
       * @readonly
       * @function
       */
      this.init = async () => {

        // Merge all helper functions and offer them via a single variable.
        $ = Object.assign( {}, this.ccm.helper, this.helper ); $.use( this.ccm );

      };

      /**
       * When the instance is created and after all dependent sub-instances are initialized and ready. Allows the first official actions of the instance that should only happen once.
       * @async
       * @readonly
       * @function
       */
      this.ready = async () => {

        // Trigger 'ready' event
        this.onready && await this.onready( { instance: this } );

      };

      /**
       * Starts the app. The current app state is visualized in the webpage area.
       * @async
       * @readonly
       * @function
       */
      this.start = async () => {

        // Load existing app state data.
        data = await $.dataset( this.data );

        // Not exists? => Set initial app state data.
        if ( !data.sections ) data = {
          correct: 0,
          sections: []
        };
        if ( this.rounds ) data.total = this.rounds;

        // Show the first section with a constellation of transaction steps.
        this.next();

        // Trigger 'start' event.
        this.onstart && await this.onstart( { instance: this } );

      };

      /**
       * Shows the next section with another constellation of transaction steps.
       * @readonly
       * @function
       */
      this.next = () => {

        /**
         * Initial app state data for the section.
         * @type {{a: number, b: number, steps: string[], t1: {summand: number, attr: string}, t2: {summand: number, attr: string}}}
         */
        const section = {
          a: random( ...this.random.value ),
          b: random( ...this.random.value ),
          steps: [],
          t1: {
            attr: ( this.random?.b || 0 ) <= Math.random() * 100 ? 'a' : 'b',
            summand: 0
          },
          t2: {
            attr: ( this.random?.b || 0 ) <= Math.random() * 100 ? 'a' : 'b',
            summand: 0
          }
        };

        // Calculation of two different summands.
        do {
          section.t1.summand = random( ...this.random.summand );
          section.t2.summand = random( ...this.random.summand );
        } while ( section.t1.summand === section.t2.summand );

        // Generate list of all transaction steps.
        const steps = [];
        for ( let i = 1; i <= 2; i++ )
          ( this.t_ops ? this.t_ops[ i - 1 ] : Object.keys( this.ops ) ).forEach( op => steps.push( 'T' + i + ',' + op ) );

        /**
         * Previously generated constellations of valid transaction steps.
         * @type {string[][]}
         */
        const constellations = data.sections.map( section => section.steps.toString() );

        // Generate a new constellation of valid transaction steps.
        let repeats = 0;                                                     // Previous number of attempts to find a new constellation.
        const anomaly = ( this.random?.match || 0 ) > Math.random() * 100;   // Indicates whether at least one anomaly must be included.
        do {

          // Shuffle list of all transaction steps and put them in a valid order using topological sorting.
          section.steps = this.toposort( $.shuffleArray( steps ), this.topology[ 0 ] );

          /**
           * Indicates whether transaction T1 ([0]) or T2 ([1]) was rolled back.
           * @type {[boolean,boolean]}
           */
          const rollbacks = [ false, false ];

          // Removal of not needed transaction steps.
          section.steps = section.steps.filter( step => {

            let [ t, op ] = step.split( ',' );  // op: Transaction operation index ('read1', 'add_x', 'write', 'read2' or 'rollb')
            t = parseInt( t[ 1 ] ) - 1;         // t = Transaction index ([0]: T1, [1]: T2)
            const rollback = rollbacks[ t ];    // rollback: Transaction is rolled back.

            // There is only a certain probability of a second read operation.
            if ( op === 'read2' && ( this.random?.read2 || 0 ) <= Math.random() * 100 ) return false;

            // There is only a certain probability of a rollback operation.
            if ( op === 'rollb' ) {
              if ( this.random?.rollb <= Math.random() * 100 ) return false;

              // All transaction steps after a rollback are removed.
              rollbacks[ t ] = true;
            }
            return !rollback;
          } );
        } while ( ( constellations.includes( section.steps.toString() ) || this.topology.length > 1 && !solution( section ).includes( true ) && anomaly ) && ++repeats <= 500 );
        if ( repeats > 500 && this.topology.length === 1 ) return this.start();

        // Add section data to app state data.
        data.sections.push( section );

        // Update main HTML template.
        this.html.render( this.html.main( this, this.section2table( section ) ), this.element );
        this.html.render( this.html.inputs( this ), this.element.querySelector( '#inputs' ) );

        // Trigger the 'change' event due to the start of the next section.
        this.onchange && this.onchange( { event: 'next', instance: this } );

      };

      /**
       * Converts the app state data of a section to table values.
       * @readonly
       * @function
       * @param {object} section - App state data of a section.
       * @returns {[[number,string,string,number,number|string,number|string,number,number|string,number|string]]} - Table values
       */
      this.section2table = section => {

        /**
         * Transactions data
         * @type {{t1: {nr: number, a: number, b: number, summand: number}, t2: {nr: number, a: number, b: number, summand: number}}}
         */
        const data = {
          t1: { nr: 1, a: 0, b: 0, summand: section.t1.summand },
          t2: { nr: 2, a: 0, b: 0, summand: section.t2.summand }
        };

        /**
         * Table values
         * @type {[[number,string,string,number,number|string,number|string,number,number|string,number|string]]}
         */
        const values = section.steps.map( ( step, i ) => {

          let [ tn, op ] = step.split( ',' );  // op: Transaction operation index ('read1', 'add_x', 'write', 'read2' or 'rollb')
          tn = tn.toLowerCase();               // tn: Transaction index ('t1' or 't2')
          const t = data[ tn ];                // t: Data of the active transaction
          const attr = section[ tn ].attr;     // attr: Database attribute on which the transaction works ('a' or 'b').

          // Calculate the attribute values for this transaction step.
          switch ( op ) {
            case 'read1':
            case 'read2': t[ attr ] = section[ attr ]; break;
            case 'add_x': t[ attr ] += t.summand; t.added = true; break;
            case 'write': section[ attr ] = t[ attr ]; t[ attr ] = 0; break;
            case 'rollb': if ( t.added ) section[ attr ] -= t.summand; t[ attr ] = 0; break;
          }

          // Replace placeholder for database attributes.
          op = this.ops[ op ];
          op = op.replaceAll( '{a}', attr ).replaceAll( '{A}', attr.toUpperCase() );
          op = op.replaceAll( '{x}', t.summand.toString() );

          // Compilation of the values for this table row.
          return [ i + 1, t.nr === 1 ? op : '', t.nr === 2 ? op : '', section.a, data.t1.a || '-', data.t2.a || '-', section.b, data.t1.b || '-', data.t2.b || '-' ];
        } );

        // Randomly swap the transaction steps of T1 and T2.
        this.t_ops && random( 0, 1 ) && values.forEach( row => [ row[ 1 ], row[ 2 ], row[ 3 ], row[ 4 ], row[ 5 ], row[ 6 ], row[ 7 ], row[ 8 ] ] = [ row[ 2 ], row[ 1 ], row[ 3 ], row[ 5 ], row[ 4 ], row[ 6 ], row[ 8 ], row[ 7 ] ] );

        // Add column names to the table.
        values.unshift( this.cols );

        // No second database attribute? => Remove corresponding columns.
        !this.random.b && values.forEach( row => row.length = 6 );

        return values;
      };

      /**
       * Returns the current app state.
       * @readonly
       * @function
       * @returns {app_state} A deep copy of the app state data.
       */
      this.getValue = () => $.clone( data );

      /**
       * Contains all event handlers.
       * @namespace AppEvents
       * @readonly
       * @type {Object.<string,function>}
       */
      this.events = {

        /**
         * When an answer is clicked.
         * @function
         * @memberOf AppEvents
         */
        onAnswer: () => {

          /**
           * App state data of the current section.
           * @type {object}
           */
          const section = data.sections.at( -1 );

          // Cancel if the app is not a trainer but only a generator or if the solution has already been revealed.
          if ( this.topology.length === 1 || section.solution ) return;

          // Update the user's input in the current section's app status data.
          section.input = Object.values( $.formData( this.element ) );

          // Update the HTML template for the input fields.
          this.html.render( this.html.inputs( this, section ), this.element.querySelector( '#inputs' ) )

          // Trigger the 'change' event due to user has chosen an answer.
          this.onchange && this.onchange( { event: 'answer', instance: this } );

        },

        /**
         * When the button to submit a solution is clicked.
         * @function
         * @memberOf AppEvents
         */
        onSubmit: () => {

          /**
           * App state data of the current section.
           * @type {object}
           */
          const section = data.sections.at( -1 );

          // Cancel if the app is not a trainer but only a generator or if the solution has already been revealed or user input is still missing.
          if ( this.topology.length === 1 || section.solution || !section.input || section.input.includes( '' ) ) return;

          // Determine the correct answer and add it in the app state data of the current section.
          section.solution = solution( section );

          // In the current section's app status data, add whether the user input matches the solution.
          section.points = 0; section.total = section.solution.length;
          for ( let i = 0; i < section.total; i++ )
            section.input[ i ] === section.solution[ i ] && section.points++;
          section.correct = section.points === section.total;
          section.correct && data.correct++;

          // Update the HTML template for the input fields.
          this.html.render( this.html.inputs( this, section ), this.element.querySelector( '#inputs' ) );

          // Trigger the 'change' event due to user input being submitted.
          this.onchange && this.onchange( { event: 'submit', instance: this } );

        },

        /**
         * When the button that starts the next phrase is clicked.
         * @function
         * @memberOf AppEvents
         */
        onNext: () => {

          // Cancel if the app is not a trainer but only a generator and the solution has either not yet been revealed or it is the last round.
          if ( this.topology.length > 1 && ( this.solution || this.rounds && data.sections.length >= this.rounds ) ) return;

          // Show the next section with another constellation of transaction steps.
          this.next();

          // Update the HTML template for the input fields.
          this.html.render( this.html.inputs( this ), this.element.querySelector( '#inputs' ) );

        },

        /**
         * When the finish button is clicked.
         * @function
         * @memberOf AppEvents
         */
        onFinish: () => {

          // Cancel if the app is not a trainer but only a generator and the solution has either not yet been revealed or it is not the last round.
          if ( this.topology.length === 1 || !this.rounds || data.sections.length < this.rounds || !data.sections.at( -1 ).solution ) return;

          // Trigger the 'finish' event.
          $.onFinish( this );

        }

      };

      /**
       * Generates a random number within a range.
       * @private
       * @function
       * @param {number} min - Minimum possible value
       * @param {number} max - Maximum possible value
       * @returns {number}
       */
      const random = ( min, max ) => Math.floor( Math.random() * ( max - min + 1 ) + min );

      /**
       * Determines the correct solution of a section.
       * @param {object} section - App state data of a section
       * @returns {boolean[]}
       */
      const solution = section => this.topology.slice( 1 ).map( topology => {
        if ( section.t1.attr !== section.t2.attr ) return false;
        const whitelists = topology.whitelists?.map( list => {
          const whitelist = list.map( rule => {
            rule = rule.map( op => section.steps.indexOf( op ) );
            return !rule.includes( -1 ) && rule[ 0 ] < rule[ 1 ];
          } );
          return !whitelist.includes( false );
        } );
        const blacklist = topology.blacklist?.map( rule => {
          rule = rule.map( op => section.steps.indexOf( op ) );
          return !rule.includes( -1 ) && rule[ 0 ] < rule[ 1 ];
        } );
        return ( !whitelists || whitelists?.includes( true ) ) && !blacklist?.includes( true );
      } );

    }
  };
  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||[""])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){(c="latest"?window.ccm:window.ccm[c]).component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();

/**
 * App configuration
 * @typedef {object} app_config
 * @prop {array} css - CSS dependencies.
 * @prop {array} helper - Dependency on helper functions.
 * @prop {Object.<string,TemplateResult>} html - HTML template dependencies.
 * @prop {string} [logos] - Show image of logos in the bottom of the app.
 * @prop {function} [onchange] - When something changes in the app (user has chooses an answer, submit of user input, start of next section).
 * @prop {function|object} [onfinish] - When the finish button is clicked. Sets the finish actions.
 * @prop {function} [onready] - Is called once before the first start of the app.
 * @prop {function} [onstart] - When the app has finished starting.
 * @prop {array} toposort - Dependency to topological sorting algorithm.
 * @prop {string[]} cols - Labeling of the table columns.
 * @prop {object} ops - Definition of the database operations possible in a transaction.
 * @prop {string} [ops.read0] - Pre-read operation
 * @prop {string} ops.read1 - Read operation
 * @prop {string} ops.add_x - Arithmetic operation on the read database attribute.
 * @prop {string} ops.write - Write operation
 * @prop {string} [ops.rollb] - Rollback of all database operations of the transaction.
 * @prop {object>} random - Sets random factors in the app.
 * @prop {number} random.b - Probability that T2 uses a different database attribute (0.100).
 * @prop {number} random.read0 - Probability that a pre-read operation will occur (0-100).
 * @prop {number} random.rollb - Probability that a rollback will occur (0-100).
 * @prop {number} random.match - Probability that an anomaly occurs (0-100).
 * @prop {[number,number]} random.value - Initial value of a database attribute (random number between min and max).
 * @prop {[number,number]} random.summand - Summand for the arithmetic operation (random number between min and max).
 * @prop {object} text - Texts and Labels in the app.
 * @prop {string} text.title - App title
 * @prop {string} text.task - Task description
 * @prop {string} text.yes - Label of the 'Yes'-button
 * @prop {string} text.neither - Label of the 'Neither'-button
 * @prop {string} text.no - Label of the 'No'-button
 * @prop {string} text.submit - Label of the 'Submit'-button
 * @prop {string} text.next - Label of the 'Next'-button
 * @prop {string} text.finish - Label of the 'Finish'-button
 * @prop {(string[][]|{whitelists: string[][][], blacklist: string[][], label: string})[]} topology - Topological sorting rules
 */

/**
 * App state data
 * @typedef {object} app_state
 * @prop {number} correct - Number of correctly answered sections.
 * @prop {number} total - Number of sections.
 * @prop {app_section[]} sections - Data on the individual sections.
 */

/**
 * App state data of a section
 * @typedef {object} app_section
 */

/**
 * @overview App configurations of <i>ccmjs</i>-based web component for Anomaly Trainer.
 * @author André Kless <andre.kless@web.de> 2022
 * @license The MIT License (MIT)
 */

/**
 * Used app configuration of <i>ccmjs</i>-based web component for Anomaly Trainer.
 * @module AppConfig
 */

/**
 * Basic configuration.
 * @type {app_config}
 */
export const config = {
  "title": "Anomalie-Trainer",  // Titel der oben in der App dargestellt wird. Unter dem Titel ist die Aufgabenbeschreibung (task).
  "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen eine Anomalie aufgetreten ist.",
  "cols": [ "", "T1", "T2", "A", "a1", "a2" ],  // Beschriftung der Tabellenspalten.
  "ops": {  // Festlegung der bei einer Transaktion möglichen Datenbankoperationen:
    "read1": "read({A},{a})",    // Erste Leseoperation
    "read2": "read({A},{a})",    // Zweite Leseoperation
    "add_x": "{a} = {a} + {x}",  // Rechenoperation auf dem gelesenen Datenbankattribut.
    "write": "write({A},{a})",   // Schreiboperation
    "rollb": "rollback"          // Zurückrollen aller Datenbankoperationen der Transaktion.
  },
  "random": {
    "b": 3,               // Wahrscheinlichkeit mit der T2 ein anderes Datenbankattribut nutzt.
    "read2": 3,           // Wahrscheinlichkeit mit der eine bestimmte Datenbankoperation...
    "rollb": 3,           // ...in einer Transaktion vorkommt (0: Nie, 1: Immer (default), 3: 1 zu 3).
    "value": [ 10, 80 ],  // Startwert des Datenbankattributs (Zufallszahl zwischen min und max).
    "summand": [ 1, 9 ]   // Summand für die Rechenoperation (Zufallszahl zwischen min und max).
  },
  "buttons": {   // Beschriftung der Buttons
    "generate": "Neue Konstellation generieren",
    "yes": "Ja",
    "neither": "",
    "no": "Nein",
    "submit": "Abschicken"
  },
  "logos": "./resources/img/logos/logos.jpg",  // Logos die unter der App dargestellt werden.
  "topology": [  // Topologische Sortierungsregeln zur Beeinflussung der Reihenfolge in der...
    [                     // ...die Datenbankoperationen einer Transaktion auftreten können.
      // Standardregeln
      [ "T1,read1", "T1,read2" ],  // Das erste Lesen immer vor dem zweiten Lesen.
      [ "T1,read2", "T1,add_x" ],  // Erst Lesen, dann Addieren.
      [ "T1,add_x", "T1,write" ],  // Erst Addieren, dann Schreiben.
      [ "T1,read1", "T1,rollb" ],  // Zurückrollen erst ab dem ersten Lesen möglich.
      [ "T2,read1", "T2,add_x" ],  // Auch für T2 gilt: erst Lesen, dann Addieren.
      [ "T2,add_x", "T2,write" ]   // Auch für T2 gilt: erst Addieren, dann Schreiben.
    ],
    {
      "label": "Lost Update",
      "whitelist": [
        [ "T1,read2", "T2,write" ],
        [ "T2,write", "T1,write" ]
      ]
    },
    {
      "label": "Non-Repeatable Read",
      "whitelist": [
        [ "T1,read1", "T2,write" ],
        [ "T2,write", "T1,read2" ]
      ]
    },
    {
      "label": "Dirty Read",
      "whitelist": [
        [ "T1,write", "T2,read1" ],
        [ "T2,read1", "T1,rollb" ]
      ]
    }
  ]
};

/**
 * Configuration to show Lost Update phenomena.
 * @type {app_config}
 */
export const lost_update_gen = {
  "title": "\"Lost Update\"-Generator",
  "task": "Beim \"Lost Update\"-Phänomen wird ein Wert, der von einer Transaktion geschrieben wurde von einer anderen Transaktion überschrieben.",
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})"
  },
  "t_ops": null,
  "random": {
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "topology": [
    [
      // Default Rules
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      // Lost Update Rules
      [ "T1,read1", "T2,write" ],
      [ "T2,write", "T1,write" ]
    ]
  ]
};

/**
 * Configuration to show Non-Repeatable Read phenomena.
 * @type {app_config}
 */
export const non_repeatable_read_gen = {
  "title": "\"Non-Repeatable Read\"-Generator",
  "task": "Beim \"Non-Repeatable Read\"-Phänomen kann eine Transaktion während ihrer Laufzeit von einem Attribut zu unterschiedlichen Zeitpunkten unterschiedliche Werte lesen, da das Attribut während der Transaktion von einer anderen Transaktion verändert wurde.",
  "ops": {
    "read1": "read({A},{a})",
    "read2": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "rollb": "rollback"
  },
  "t_ops": [
    [ "read1", "read2", "rollb" ],  // T1
    [ "read1", "add_x", "write" ]   // T2
  ],
  "random": {
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "topology": [
    [
      // Default Rules
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      // Non-Repeatable-Read Rules
      [ "T1,read1", "T2,write" ],
      [ "T2,write", "T1,read2" ],
      [ "T1,read2", "T1,rollb" ]
    ]
  ]
};

/**
 * Configuration to show Dirty Read phenomena.
 * @type {app_config}
 */
export const dirty_read_gen = {
  "title": "\"Dirty Read\"-Generator",
  "task": "Beim \"Dirty Read\"-Phänomen verändert eine Transaktion einen Wert, welcher von einer anderen Transaktion gelesen wird. Die Transaktion, die das Attribut verändert hat, wird allerdings zurückgesetzt und die andere Transaktion, die den veränderten Wert des Attributs gelesen hat, arbeitet auf einen \"verschmutzten\" Wert.",
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "rollb": "rollback"
  },
  "t_ops": [
    [ "read1", "add_x", "write", "rollb" ],  // T1
    [ "read1", "add_x", "write" ]            // T2
  ],
  "random": {
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "topology": [
    [
      // Default Rules
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      // Dirty Read Rules
      [ "T1,write", "T2,read1" ],
      [ "T2,read1", "T1,rollb" ]
    ]
  ]
};

/**
 * Configuration to train Lost Update phenomena.
 * @type {app_config}
 */
export const lost_update_trainer = {
  "title": "\"Lost Update\"-Trainer",
  "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen ein \"Lost Update\" aufgetreten ist.",
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})"
  },
  "t_ops": null,
  "random": {
    "b": 3,
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "topology": [
    [
      // Default Rules
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
    ],
    {
      // 'Lost Update' Rules
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
    }
  ]
};

/**
 * Configuration to train Non-Repeatable-Read phenomena.
 * @type {app_config}
 */
export const non_repeatable_read_trainer = {
  "title": "\"Non-Repeatable Read\"-Trainer",
  "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen ein \"Non-Repeatable Read\" aufgetreten ist.",
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "read2": "read({A},{a})"
  },
  "t_ops": null,
  "random": {
    "b": 3,
    "read2": 3,
    "rollb": 3,
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "topology": [
    [
      // Default Rules
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      [ "T1,read1", "T1,read2" ]
    ],
    {
      // 'Non-Repeatable Read' Rules
      "label": "Non-Repeatable Read",
      "whitelists": [
        [
          [ "T1,read1", "T2,write" ],
          [ "T2,write", "T1,read2" ]
        ]
      ]
    }
  ]
};

/**
 * Configuration to train Dirty Read phenomena.
 * @type {app_config}
 */
export const dirty_read_trainer = {
  "title": "\"Dirty Read\"-Trainer",
  "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen ein \"Dirty Read\" aufgetreten ist.",
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "rollb": "rollback"
  },
  "t_ops": null,
  "random": {
    "b": 3,
    "rollb": 3,
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "topology": [
    [
      // Default Rules
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      [ "T1,read1", "T1,rollb" ]
    ],
    {
      // 'Dirty Read' Rules
      "label": "Dirty Read",
      "whitelists": [
        [
          [ "T1,write", "T2,read1" ],
          [ "T2,read1", "T1,rollb" ]
        ]
      ]
    }
  ]
};

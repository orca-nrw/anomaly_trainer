/**
 * @overview App configurations of <i>ccmjs</i>-based web component for Anomaly Trainer.
 * @author André Kless <andre.kless@web.de> 2022-2023
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
export const configx = {
  "title": "Anomalie-Trainer",  // Titel der oben in der App dargestellt wird. Unter dem Titel ist die Aufgabenbeschreibung (task).
  "task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen eine Anomalie aufgetreten ist.",
  // "cols": [ "", "T1", "T2", "A", "a1", "a2" ],  // Beschriftung der Tabellenspalten.
  "ops": {  // Festlegung der bei einer Transaktion möglichen Datenbankoperationen:
    "read0": "read({A},{a})",    // Vorab-Leseoperation
    "read1": "read({A},{a})",    // Leseoperation
    "add_x": "{a} = {a} + {x}",  // Rechenoperation auf dem gelesenen Datenbankattribut.
    "write": "write({A},{a})",   // Schreiboperation
    "rollb": "rollback"          // Zurückrollen aller Datenbankoperationen der Transaktion.
  },
  "random": {
    "b": 30,              // Wahrscheinlichkeit mit der T2 ein anderes Datenbankattribut nutzt (0-100).
    "read0": 30,          // Wahrscheinlichkeit mit der eine Vorab-Leseoperation vorkommt (0-100).
    "rollb": 30,          // Wahrscheinlichkeit mit der ein Rollback vorkommt (0-100).
    "match": 50,          // Wahrscheinlichkeit mit der eine Anomalie vorkommt (0-100).
    "value": [ 10, 80 ],  // Startwert eines Datenbankattributs (Zufallszahl zwischen min und max).
    "summand": [ 1, 9 ]   // Summand für die Rechenoperation (Zufallszahl zwischen min und max).
  },
  "text": {
    /* Beschriftung der Buttons */
    "yes": "Ja",
    "neither": "",
    "no": "Nein",
    "submit": "Abschicken",
    "next": "Nächste",
    "finish": "Neustart"
  },
  "logos": "./resources/img/logos/logos.jpg",  // Logos die unter der App dargestellt werden.
  "topology": [  // Topologische Sortierungsregeln zur Beeinflussung der Reihenfolge in der...
    [                     // ...die Datenbankoperationen einer Transaktion auftreten können.
      // Standardregeln
      [ "T1,read0", "T1,read1" ],  // Das erste Lesen immer vor dem zweiten Lesen.
      [ "T1,read1", "T1,add_x" ],  // Erst Lesen, dann Addieren.
      [ "T1,add_x", "T1,write" ],  // Erst Addieren, dann Schreiben.
      [ "T1,write", "T1,rollb" ],  // Zurückrollen erst ab dem ersten Lesen möglich.
      [ "T2,read1", "T2,add_x" ],  // Auch für T2 gilt: erst Lesen, dann Addieren.
      [ "T2,add_x", "T2,write" ]   // Auch für T2 gilt: erst Addieren, dann Schreiben.
    ],
    {
      "label": "Lost Update",
      "whitelist": [
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
      "whitelist": [
        [ "T1,read0", "T2,write" ],
        [ "T2,write", "T1,read1" ]
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
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})"
  },
  "t_ops": [
    [ "read1", "add_x", "write" ],  // T1
    [ "read1", "add_x", "write" ]   // T2
  ],
  "random": {
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "rounds": "",
  "text.title": "\"Lost Update\"-Generator",
  "text.task": "Beim \"Lost Update\"-Phänomen wird ein Wert, der von einer Transaktion geschrieben wurde von einer anderen Transaktion überschrieben.",
  "text.next": "Neue Konstellation generieren",
  "topology": [
    [
      // Default Rules
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      // 'Lost Update' Rules
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
    "read0": "read({A},{a})",
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})",
    "rollb": "rollback"
  },
  "t_ops": [
    [ "read0", "read1", "rollb" ],  // T1
    [ "read1", "add_x", "write" ]   // T2
  ],
  "random": {
    "read0": 100,
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "rounds": "",
  "text.title": "\"Non-Repeatable Read\"-Generator",
  "text.task": "Beim \"Non-Repeatable Read\"-Phänomen kann eine Transaktion während ihrer Laufzeit von einem Attribut zu unterschiedlichen Zeitpunkten unterschiedliche Werte lesen, da das Attribut während der Transaktion von einer anderen Transaktion verändert wurde.",
  "text.next": "Neue Konstellation generieren",
  "topology": [
    [
      // Default Rules
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      // 'Non-Repeatable Read' Rules
      [ "T1,read0", "T2,write" ],
      [ "T2,write", "T1,read1" ],
      [ "T1,read1", "T1,rollb" ]
    ]
  ]
};

/**
 * Configuration to show Dirty Read phenomena.
 * @type {app_config}
 */
export const dirty_read_gen = {
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
    "rollb": 100,
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "rounds": "",
  "text.title": "\"Dirty Read\"-Generator",
  "text.task": "Beim \"Dirty Read\"-Phänomen verändert eine Transaktion einen Wert, welcher von einer anderen Transaktion gelesen wird. Die Transaktion, die das Attribut verändert hat, wird allerdings zurückgesetzt und die andere Transaktion, die den veränderten Wert des Attributs gelesen hat, arbeitet auf einen \"verschmutzten\" Wert.",
  "text.next": "Neue Konstellation generieren",
  "topology": [
    [
      // Default Rules
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ],
      // 'Dirty Read' Rules
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
  "ops": {
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})"
  },
  "t_ops": null,
  "random": {
    "b": 30,
    "match": 50,
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "text.title": "\"Lost Update\"-Trainer",
  "text.task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen ein \"Lost Update\" aufgetreten ist.",
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
 * Configuration to train Non-Repeatable-Read phenomena (short version).
 * @type {app_config}
 */
export const non_repeatable_read_trainer = {
  "ops": {
    "read0": "read({A},{a})",
    "read1": "read({A},{a})",
    "add_x": "{a} = {a} + {x}",
    "write": "write({A},{a})"
  },
  "t_ops": [
    [ "read0", "read1" ],           // T1
    [ "read1", "add_x", "write" ]   // T2
  ],
  "random": {
    "b": 10,
    "read0": 100,
    "match": 60,
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "rounds": 6,
  "text.title": "\"Non-Repeatable Read\"-Trainer",
  "text.task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen ein \"Non-Repeatable Read\" aufgetreten ist.",
  "topology": [
    [
      // Default Rules
      [ "T1,read0", "T1,read1" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ]
    ],
    {
      // 'Non-Repeatable Read' Rules
      "label": "Non-Repeatable Read",
      "whitelists": [
        [
          [ "T1,read0", "T2,write" ],
          [ "T2,write", "T1,read1" ]
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
    "b": 30,
    "rollb": 90,
    "match": 50,
    "value": [ 10, 80 ],
    "summand": [ 1, 9 ]
  },
  "rounds": 6,
  "text.title": "\"Dirty Read\"-Trainer",
  "text.task": "Prüfen Sie, ob während der folgenden beiden Datenbank-Transaktionen ein \"Dirty Read\" aufgetreten ist.",
  "topology": [
    [
      // Default Rules
      [ "T1,read1", "T1,add_x" ],
      [ "T1,add_x", "T1,write" ],
      [ "T1,write", "T1,rollb" ],
      [ "T2,read1", "T2,add_x" ],
      [ "T2,add_x", "T2,write" ]
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

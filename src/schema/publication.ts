import { JSONSchema6 } from 'json-schema'
import { mappers } from '../mappers'

export const inbound : any = {
  "Name" : {
    "kumu": mappers.label()
  },
  "About" : {
    "kumu": mappers.skip()
  },
  "URL" : {
    "kumu": mappers.string('Website')
  },
  "Publication Type" : {
    "kumu": mappers.string('SubType')
  },
  "Sponsoring Org" : {
    "kumu": mappers.string('Parent Org')
  },
  "Author(s)/Editor(s)" : {
    "kumu": mappers.publicationAuthors()
  },
  "Audience" : {
    "kumu": mappers.default('')
  },
  "Sponsoring Organization" : {
    "kumu": mappers.publicationOrgs()
  },
  "Working Group" : {
    "kumu": mappers.default('')
  },
  "Tags" : {
    "kumu": mappers.default('')
  },
  "License" : {
    "kumu": mappers.default('')
  },
  "Volume Frequency" : {
    "kumu": mappers.default('')
  },
  "Version or Edition" : {
    "kumu": mappers.default('')
  },
  "Date" : {
    "kumu": mappers.default('')
  },
  "Sector" : {
    "kumu": mappers.default('')
  },
  "Purpose": {
    "kumu": mappers.default('')
  },
  "Digital Harms Addressed": {
    "kumu": mappers.default('')
  },
  "Tech Focus": {
    "kumu": mappers.default('')
  },
  "Jurisdiction": {
    "kumu": mappers.default('')
  },
  "Github Profile": {
    "kumu": mappers.default('')
  }
}


export const schema : JSONSchema6 = {

  "$id": "http://example.com/publication#",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Publication",
  "type": "object",
  "required": [ ],
  "additionalProperties": false,
  "properties" : {
    "Name" : {
        "type": "string",

        "description": ""
    },
    "About" : {
        "type": "string",

        "description": ""
    },
    "URL" : {
        "type": "string",
        "format":"url",

        "description": ""
    },
    "Publication Type" : {
        "type": "string",
        "description": "",
        "enum": [
            "blog post",
            "book",
            "event summary or output",
            "glossary",
            "journal",
            "legal document",
            "license",
            "magazine",
            "news article",
            "op ed",
            "paper",
            "podcast",
            "report",
            "standard",
            "terms of service",
            "Trust Framework",
            "video"
        ]
    },
    "Sponsoring Org" : {
        "type": "string",
        "description": ""
    },
    "Author(s)/Editor(s)" : {
        "type": "array",

        "description": "",
        "items": {
            "type": "string"
        }
    },
    "Audience" : {
        "type": "string",
        "description": "",
        "enum": [
            "C suite decision makers",
            "consumer technology vendors",
            "enterprise technology vendors",
            "general public",
            "government workers",
            "legislators",
            "marginalized and disadvantage communities",
            "product users",
            "researchers"
        ]
    },
    "Sponsoring Organization" : {
        "type": "string",
        "description": ""
    },
    "Working Group" : {
        "type": "string",
        "description": ""
    },
    "Tags" : {
        "type": "array",
        "description": "",
        "items": {
            "type": "string"
        }
    },
    "License" : {
        "type": "string",

        "description": ""
    },
    "Volume Frequency" : {
        "type": "string",

        "description": ""
    },
    "Version or Edition" : {
        "type": "string",

        "description": ""
    },
    "Date" : {
        "type": "string",
        "format": "date",
        "description": ""
    },
    "Sector" : {
        "type": "string",
        "description": "",
        "enum": [
        ]
    },
    "Purpose": {
        "type": "string",
        "description": "",
        "enum": [
            "education",
            "human rights",
            "usability",
            "tech interoperability",
            "governance",
            "certification and compliance",
            "transparancy and accountability"
        ]
    },
    "Digital Harms Addressed": {
		"type": "string",
    	"enum": [
			"AGGREGATION",
			"APPROPRIATION",
			"BLACKMAIL",
			"BREACH OF CONFIDENTIALITY",
			"DECISIONAL INTERFERENCE",
			"DISCLOSURE",
			"DISTORTION",
			"EXCLUSION",
			"EXPOSURE",
			"IDENTIFICATION",
			"INCREASED ACCESSIBILITY",
			"INSECURITY",
			"INTERROGATION",
			"INTRUSION",
			"SECONDARY USE",
			"SURVEILLANCE"
		]
	},
    "Tech Focus": {
    	"type": "string",
    	"enum": [
    		"Identity",
    		"Data Mobility",
    		"Terms Management",
    		"Information Sharing Control",
    		"Data Storage"
    	]
    },
    "Jurisdiction": {
    	"type": "string"
    },
    "Github Profile": {
    	"type": "string",
    	"format": "url"
    }
  },
}

import { JSONSchema6 } from 'json-schema'
import { mappers } from '../mappers'

export const inbound : any = {
  "Name" : {
    "kumu": mappers.default('')
  },
  "Description" : {
    "kumu": mappers.default('')
  },
  "URL" : {
    "kumu": mappers.default('')
  },
  "Category" : {
    "kumu": mappers.default('')
  },
  "Parent Org" : {
    "kumu": mappers.default('')
  },
  "People" : {
    "kumu": mappers.default('')
  },
  "Audience" : {
    "kumu": mappers.default('')
  },
  "Partners" : {
    "kumu": mappers.default('')
  },
  "Working Group" : {
    "kumu": mappers.default('')
  },
  "Tags": {
    "kumu": mappers.default('')
  },
  "License" : {
    "kumu": mappers.default('')
  },
  "Version or Edition" : {
    "kumu": mappers.default('')
  },
  "Date Begun" : {
    "kumu": mappers.default('')
  },
  "Date Ended" : {
    "kumu": mappers.default('')
  },
  "Purpose": {
    "kumu": mappers.default('')
  },
  "Digital Harms Addressed": {
    "kumu": mappers.default('')
  },
  "Supported Identity Technologies" : {
    "kumu": mappers.default('')
  },
  "Activities" : {
    "kumu": mappers.default('')
  },
  "Status" : {
    "kumu": mappers.default('')
  },
  "Me2B Participation" : {
    "kumu": mappers.default('')
  },
  "Terms of Service" : {
    "kumu": mappers.default('')
  },
  "Github Profile" : {
    "kumu": mappers.default('')
  },
  "Relevant Publications" : {
    "kumu": mappers.default('')
  }
}


export const schema : JSONSchema6 = {
  "$id": "http://example.com/publication#",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Project or Product",
  "type": "object",
  "required": [ ],
  "additionalProperties": false,
  "properties" : {
    "Name" : {
        "type": "string",
        "description": ""
    },
    "Description" : {
        "type": "string",
        "description": ""
    },
    "URL" : {
        "type": "string",
        "format":"url",
        "description": ""
    },
    "Category" : {
        "type": "string",
        "format":"url",
        "description": "",
        "enum": [
          "open source",
          "pilot",
          "proof of concept",
          "research",
          "service",
          "other"
        ]
    },
    "Parent Org" : {
        "type": "string",
        "description": ""
    },
    "People" : {
        "type": "string",
        "description": ""
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
          "marginalizaed and disadvantaged communities",
          "product users",
          "researchers"
        ]
    },
    "Partners" : {
        "type": "string",
        "description": ""
    },
    "Working Group" : {
        "type": "string",
        "description": ""
    },
    "Tags": {
		"type": "array",
		"items": {
			"type": "string"
			}
    },
    "License" : {
        "type": "string",
        "description": ""
    },
    "Version or Edition" : {
        "type": "string",
        "description": ""
    },
    "Date Begun" : {
        "type": "string",
        "format": "date",
        "description": ""
    },
    "Date Ended" : {
        "type": "string",
        "format": "date",
        "description": ""
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
    "Supported Identity Technologies" : {
        "type": "array",
        "description": "",
        "items": {
            "type":"string"
        }
    },
    "Activities" : {
        "type": "string",
        "description": "",
    },
    "Status" : {
        "type": "string",
        "description": "",
    },
    "Me2B Participation" : {
        "type": "string",
        "description": "",
    },
    "Terms of Service" : {
        "type": "string",
        "description": "",
    },
    "Github Profile" : {
        "type": "string",
        "format": "url",
        "description": "",
    },
    "Relevant Publications" : {
        "type": "array",
        "description": "",
        "items": {
            "type":"string"
        }
    }
  },
}

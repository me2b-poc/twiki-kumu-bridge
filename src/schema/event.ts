import { JSONSchema6 } from 'json-schema'
import { mappers } from '../mappers'

export const inbound : any = {
  "Name" : {
    "kumu": mappers.string("Label")
  },
  "Description" : {
    "kumu": mappers.string("Description")
  },
  "Website" : {
    "kumu": mappers.url("Website")
  },
  "Category" : {
    "kumu": mappers.default('')
  },
  "Host Organization" : {
    "kumu": mappers.default('')
  },
  "People" : {
    "kumu": mappers.default('')
  },
  "Audience" : {
    "kumu": mappers.default('')
  },
  "Partners / Host Sponsor Venue" : {
    "kumu": mappers.default('')
  },
  "Working Group" : {
    "kumu": mappers.default('')
  },
  "Tags": {
    "kumu": mappers.tagArray('Tags')
  },
  "Frequency" : {
    "kumu": mappers.default('')
  },
  "Date" : {
    "kumu": mappers.default('')
  },
  "Location(s)": {
    "kumu": mappers.default('')
  },
  "Github Profile": {
    "kumu": mappers.default('')
  },
  "Relevant Publications" : {
    "kumu": mappers.default('')
  }
}

export const schema : JSONSchema6 = {
  "$id": "http://example.com/publication#",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Event",
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
    "Website" : {
        "type": "string",
        "format":"url",
        "description": ""
    },
    "Category" : {
        "type": "string",
        "format":"url",
        "description": "",
        "enum": [
          "Size",
          "Identity",
          "Telco"
        ]
    },
    "Host Organization" : {
        "type": "string",
        "description": ""
    },
    "People" : {
        "type": "string",
        "description": ""
    },
    "Audience" : {
        "type": "string",
        "format":"url",
        "description": "",
        "enum": [
          "C suite decision makers",
          "consumer technology vendors",
          "enterprise technology vendors",
          "general public",
          "government workers",
          "legislators",
          "marginalized and diadvantaged communities",
          "product users",
          "researchers",
          "creators"
        ]
    },
    "Partners / Host Sponsor Venue" : {
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
    "Frequency" : {
        "type": "string",
        "description": "how often the event occurs",
        "enum": [
          "daily",
          "weekly",
          "monthly",
          "quarterly",
          "other"
        ]
    },
    "Date" : {
        "type": "string",
        "format": "date",
        "description": ""
    },
    "Location(s)": {
        "type": "array",
        "description": "",
        "items": {
            "type":"string"
        }
    },
    "Github Profile": {
        "type": "string",
        "format": "url",
        "description": ""
    },
    "Relevant Publications" : {
        "type": "string",
        "description": "",
    }
  },
}

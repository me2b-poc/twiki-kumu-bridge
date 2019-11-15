import { JSONSchema6 } from 'json-schema'
import { mappers } from '../mappers'

export const inbound : any = {
  "Name" : {
    "kumu": mappers.default('')
  },
  "Bio" : {
    "kumu": mappers.default('')
  },
  "Website" : {
    "kumu": mappers.default('')
  },
  "Organization" : {
    "kumu": mappers.default('')
  },
  "Working Group" : {
    "kumu": mappers.default('')
  },
  "Tags": {
    "kumu": mappers.default('')
  },
  "Location" : {
    "kumu": mappers.default('')
  },
  "Twitter Profile" : {
    "kumu": mappers.default('')
  },
  "LinkedIn Profile" : {
    "kumu": mappers.default('')
  },
  "Github Profile" : {
    "kumu": mappers.default('')
  }
}


export const schema : JSONSchema6 = {

  "$id": "http://example.com/publication#",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Person",
  "type": "object",
  "required": [ ],
  "additionalProperties": false,
  "properties" : {
    "Name" : {
        "type": "string",
        "description": ""
    },
    "Bio" : {
        "type": "string",
        "description": ""
    },
    "Website" : {
        "type": "string",
        "format":"url",
        "description": ""
    },
    "Organization" : {
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
    "Location" : {
        "type": "string",
        "description": "",
    },
    "Twitter Profile" : {
        "type": "string",
        "format": "url",
        "description": "",
    },
    "LinkedIn Profile" : {
        "type": "string",
        "format": "url",
        "description": "",
    },
    "Github Profile" : {
        "type": "string",
        "format": "url",
        "description": "",
    }
  },
}

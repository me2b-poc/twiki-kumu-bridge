import { JSONSchema6 } from 'json-schema'
import { mappers } from '../mappers'

export const inbound : any = {
  "Org Name": {
    "kumu": mappers.label()
  },
  "About": {
    "kumu": mappers.skip()
  },
  "Website": {
    "kumu": mappers.string('Website')
  },
  "Org Type": {
    "kumu": mappers.string('SubType')
  },
  "Sector": {
    "kumu": mappers.default('')
  },
  "Purpose": {
    "kumu": mappers.default('')
  },
  "Activities": {
    "kumu": mappers.default('')
  },
  "Parent Org": {
    "kumu": mappers.string('Parent Org')
  },
  "Me2B Relationship": {
    "kumu": mappers.default('')
  },
  "Key People": {
    "kumu": mappers.default('')
  },
  "Audience": {
    "kumu": mappers.default('')
  },
  "Partners": {
    "kumu": mappers.default('')
  },
  "Tags": {
    "kumu": mappers.default('')
  },
  "Date Founded": {
    "kumu": mappers.string('Start Date')
  },
  "Date Ended": {
    "kumu": mappers.string('End Date')
  },
  "Digital Harms Addressed": {
    "kumu": mappers.default('')
  },
  "Tech Focus": {
    "kumu": mappers.default('')
  },
  "Status": {
    "kumu": mappers.default('')
  },
  "Annual Budget": {
    "kumu": mappers.default('')
  },
  "Funding": {
    "kumu": mappers.default('')
  },
  "Scope": {
    "kumu": mappers.default('')
  },
  "Location(s)": {
    "kumu": mappers.default('')
  },
  "Products and or services": {
    "kumu": mappers.default('')
  },
  "Twitter Profile": {
    "kumu": mappers.default('')
  },
  "LinkedIn Profile": {
    "kumu": mappers.default('')
  },
  "Github Profile": {
    "kumu": mappers.default('')
  },
  "Relevant Publications": {
    "kumu": mappers.default('')
  }
}


export const schema : JSONSchema6 = {
  "$id": "https://example.com/organization.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "Organization",
  "type": "object",
  "properties": {
    "Org Name": {
    	type: "string",
      title: "Organization Name"
    },
    "About": {
    	"type": "string"
    },
    "Website": {
    	"type": "string",
    	"format": "url"
    },
    "Org Type": {
    	"type": "string",
    	"enum": [
    		"Coalition or Network",
    		"Government Department",
    		"Research Lab or Center",
    		"University",
    		"Standards Development Organization",
    		"TradeAssociation",
    		"University Department",
			"Non Governmental Organization",
			"Part of Supra-National Government",
			"Government",
			"Cooperative"
    	]
    },
    "Sector": {
    	"type": "string",
    	"enum": [
    		"non-profit",
    		"for-profit",
    		"government",
    		"academic"
    	]
    },
    "Purpose": {
      "type": "string",
      "enum": [
        "education",
        "human rights",
        "usability",
        "tech interoperability",
        "governance",
        "certification and compliance",
        "transparency and accountability",
        "consumer support",
        "health care"
      ]
    },
    "Activities": {
    	"type": "string",
    	"enum": [
    		"advocacy",
    		"certification",
    		"compliance auditing",
    		"events and convening",
    		"formal training and classes",
    		"funding",
    		"incubation",
    		"movement building",
    		"outreach",
    		"policy development",
    		"publication",
    		"regulation",
    		"research",
    		"software development",
    		"standard development",
        "service provider"
    	]
    },
    "Parent Org": {
    	"type": "string"
    },
    "Me2B Relationship": {
    	"type": "string",
    	"enum": [
          "Certification Candidate",
          "collaborating org",
          "member",
          "potential collaborator",
          "out of scope",
          "funder",
          "affiliates"
        	]
	   },
    "Key People": {
    	"type": "string",
    	"enum": [
    		"Board People",
    		"CEO or ED",
    		"Other Leadership",
    		"Working group chair",
        "Technical editor",
        "Employee"
    	]
    },
    "Audience": {
    	"type": "string",
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
    "Partners": {
		"type": "array",
		"maxItems": 5,
		"items": {
			"type": "string"
			}
	 },
    "Tags": {
		"type": "array",
		"items": {
			"type": "string"
			}
    },
    "Date Founded": {
    	"type": "string",
    	"format": "date"
    },
    "Date Ended": {
    	"type": "string",
    	"format": "date"
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
    "Status": {
    	"type": "string",
    	"enum": [
    		"active",
    		"inactive",
    		"merged"
    	]
    },
	"Annual Budget": {
    	"type": "string"
	},
	"Funding": {
    	"type": "string"
	},
    "Scope": {
    	"type": "string",
    	"enum": [
    		"global",
    		"national",
    		"regional",
    		"local",
    		"other"
    	]
    },
    "Location(s)": {
    	"type": "string"
    },
    "Products and or services": {
		"type": "array",
		"items": {
			"type": "string"
		}
    },
    "Twitter Profile": {
    	"type": "string",
    	"format": "url"
    },
    "LinkedIn Profile": {
    	"type": "string",
    	"format": "url"
    },
    "Github Profile": {
    	"type": "string",
    	"format": "url"
    },
    "Relevant Publications": {
    	"type": "string"
    }
  }
}

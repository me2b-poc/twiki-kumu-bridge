
import { KumuModel } from './kumu'
import { TiddlerFileBase } from './tiddly'


export interface Context {
	model:KumuModel
	tiddly:TiddlerFileBase
	schemas:any
}

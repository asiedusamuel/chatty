import { View, ViewBase } from "tns-core-modules/ui/page/page";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
export var nQueryHelper: Function;
type nQueryObject = {
    element?: nQuery,
    id?: string,
    classList?: Array<string>,
    className?: string,
    children?: Array<nQueryObject>,
    type?: string
};
export class nQuery {
    private _rootView: View;
    private _nQueryObjects: Array<nQueryObject>;
    private _nQueryObjectsTemp: Array<nQueryObject>;
    selectedArrPath: Set<nQueryObject>;
    constructor(RootView: View) {
        this._rootView = RootView;
        this._nQueryObjects = new Array;
        this._nQueryObjectsTemp = new Array;
        this.selectedArrPath = new Set<nQueryObject>();
        return this.addToProbe(this._rootView, null);
    }
    private addToProbe(view: View, parent: nQueryObject): nQuery {
        view.eachChild((v: View) => {
            let _nqo = this.createQueryObject(v);
            if (parent) {
                parent.children.push(_nqo);
            } else {
                this._nQueryObjects.push(_nqo);
            }
            this.addToProbe(v, _nqo);
            return true;
        });
        return this;
    }
    private createQueryObject(v: View): nQueryObject {
        let _nqo: nQueryObject = {
            element: new nQuery(v),
            id: v.get("id"),
            children: new Array,
            className: v.className,
            type: v.typeName
        }
        if (v.className) {
            _nqo.classList = v.className.split(' ').filter((s) => { return (s.trim() != "") })
        }
        return _nqo;
    }
    removeClass(className: string) {
        return this;
    }
    public split(...args): Array<string> {
        var u = [].slice.call(arguments); let v = u.slice(1); u = u[0]; let w: Array<string> = [u]; let x = 0;
        for (let i = 0; i < u.length; ++i) {
            for (let j = 0; j < v.length; ++j) {
                if (u.slice(i, i + v[j].length) == v[j]) {
                    let y = w[x].split(v[j]); w[x] = y[0]; w[++x] = y[1];
                };
            };
        };
        return w;
    };

    defineEl(s: string): { id?: string, classes?: Array<string>, type?: string } {
        var sSplit, noID;

        var classes: Array<string> = new Array<string>();
        var id: string = '';
        var type: string = '';

        function splice(s: string, start, delCount, newSubStr) {
            return s.slice(0, start) + newSubStr + s.slice(start + Math.abs(delCount));
        }
        var s2 = s.split('');
        for (let i = 0; i < s2.length; i++) {
            var v = s2[i];
            if (v == '.' || v == '#') {
                s = splice(s, i, 0, " ");
                s2 = s.split('');
                i++;
            }
        }

        sSplit = s.split(' ').filter((s) => { return (s.trim() != "") });;
        for (let i = 0; i < sSplit.length; i++) {
            const v: string = sSplit[i];
            if (v.charAt(0) == '.') {
                classes.push(v.substring(1))
            } else if (v.charAt(0) == '#') {
                id = v.substring(1);
            } else {
                type = v;
            }
        }

        var defObj = { id, classes, type };
        return defObj
    }

    arr_diff(a1, a2) {
        var a = [], diff = [];
        if (a1) {
            for (var i = 0; i < a1.length; i++) {
                a[a1[i]] = true;
            }
        }

        if (a2) {
            for (var i = 0; i < a2.length; i++) {
                if (a[a2[i]]) {
                    delete a[a2[i]];
                } else {
                    a[a2[i]] = true;
                }
            }
        }


        for (var k in a) {
            diff.push(k);
        }
        return diff;
    }
    arrayContains(a_array, b_array) {
        let set = new Set(b_array);
        return a_array.every(o => set.has(o));
    }

    select(selector: string): nQuery {
        // Check if single
        function hasClass(obj: nQueryObject, arr: Array<any>) {
            var bools = [];
            for (let i = 0; i < arr.length; i++) {
                const element = arr[i];
                bools.push(obj.element._rootView.cssClasses.has(element));
            }
            if (bools.indexOf(false) > -1) {
                return false;
            }
            return true;
        }
        if (selector) {
            var sArray = selector.split(' ').filter((s) => { return (s.trim() != "") })
            if (sArray.length == 1) {
                this._nQueryObjectsTemp = (this._nQueryObjectsTemp.length > 0 ? this._nQueryObjectsTemp : this._nQueryObjects);
                this._nQueryObjectsTemp.forEach((obj) => {
                    var el = this.defineEl(sArray[0]);
                    var arrDif = this.arr_diff(obj.classList, el.classes);
                    if (el.id && hasClass(obj, arrDif) && el.type == "") {
                         
                        if(!this.selectedArrPath.has(obj)) this.selectedArrPath.add(obj);
                    }
                    if (el.id == "" && hasClass(obj, arrDif) && el.type == "") {
                        //console.log('from line 2') 
                        if(!this.selectedArrPath.has(obj)) this.selectedArrPath.add(obj);
                    }
                    if (el.id == obj.id && hasClass(obj, arrDif) && el.type == "") {
                        this._nQueryObjectsTemp = obj.children;
                        //console.log('from line 3'+Math.random()) 
                        if(!this.selectedArrPath.has(obj)) this.selectedArrPath.add(obj);
                    }
                    if (el.id == "" && hasClass(obj, arrDif) && el.type == obj.type) {
                        //console.log('from line 4') 
                        if(!this.selectedArrPath.has(obj)) this.selectedArrPath.add(obj);
                    }
                    if (obj.children.length > 0) {
                        this.select(sArray[0]);
                    }
                })
            } else {
                this._nQueryObjectsTemp = (this._nQueryObjectsTemp.length > 0 ? this._nQueryObjectsTemp : this._nQueryObjects);
                let selection:Array<nQueryObject> = new Array<nQueryObject>();
                for (let k = 0; k < this._nQueryObjectsTemp.length; k++) {
                    const obj = this._nQueryObjectsTemp[k];
                    for (let i = 0; i < sArray.length; i++) {
                        const s = sArray[i];
                        var el = this.defineEl(s);
                        var arrDif = this.arr_diff(obj.classList, el.classes);
                        if (
                            (el.id && hasClass(obj, arrDif) && el.type == "")
                            ) {
                            console.log('from line 1') 
                            this.selectedArrPath.add(obj);
                        }
                        if (el.id == "" && hasClass(obj, arrDif) && el.type == "") {
                            console.log('from line 2')
                            this.selectedArrPath.add(obj);
                        }
                        if (el.id == obj.id && hasClass(obj, arrDif) && el.type == "") {
                            console.log('from line 3')
                            this.selectedArrPath.add(obj);
                        }
                        if (el.id == "" && hasClass(obj, arrDif) && el.type == obj.type) {
                            console.log('from line 4')
                            this.selectedArrPath.add(obj);
                        }
                        if (obj.children.length > 0) {
                            this._nQueryObjectsTemp = obj.children;
                            this.select(sArray[i]);
                        }
                    }
                }
                
            }
        }
        return this;
    }

    public hide() {
        console.log(this.selectedArrPath.size)        
        this.selectedArrPath.forEach((nq: nQueryObject) => {
            nq.element._rootView.visibility = 'collapse'
        })
    }
}

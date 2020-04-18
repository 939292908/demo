import NanoEvents from './nanoevents'


class EVBUS {
    //允许你直接访问
    Core = new NanoEvents()
    DelayedTimers = {}
    EmitDeDuplicate(aKey,aDelayInMS, aEvName,aParam) {
        let s = this;
        let timerId = s.DelayedTimers[aKey]
        if (!timerId) {
            timerId = setTimeout(function (){
                    delete s.DelayedTimers[aKey];
                    s.Core.emit(aEvName, aParam)
                }
                ,aDelayInMS);
            s.DelayedTimers[aKey] = timerId;
        }
    }
    emit(aEvName,aParam) {
        return this.Core.emit(aEvName,aParam);
    }
    on (event, cb) {
        return this.Core.on(event, cb)
    }
}

export default EVBUS



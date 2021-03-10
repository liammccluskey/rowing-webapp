import {pm5fields, pm5printables} from './pm5-printables'
import {PM5} from './pm5'
let m;

export let cbConnecting = function() {
    console.log('connecting')
};

export let cbConnected = function() {
    console.log('did connect')

    m.getMonitorInformation()
        .then(monitorInformation => {
            console.log(
                'FW: ' + monitorInformation.firmwareRevision + ' | ' +
                'HW: ' + monitorInformation.hardwareRevision + ' | ' +
                'MNF: '+ monitorInformation.manufacturerName + ' | ' +
                'SN: ' + monitorInformation.serialNumber
            )
        })
        .catch(error => {
            console.log(error)
        });

};

export let cbDisconnected = function() {
    console.log('did disconnect')
};

export let cbMessage = function(m) {
    console.log(m.data)

    /* iterate data elements and create / update value */
    for (let k in m.data) {
        if (m.data.hasOwnProperty(k)) {
            /*
            let selector = '#' + m.type + ' span.' + k;
            let s = document.querySelector(selector);
            
           
            if (!s) {
                let p = document.createElement('div');     

                let desc = document.createElement('span');
                desc.className = 'element';
                desc.textContent = pm5fields[k].label;

                s = document.createElement('span');     
                s.className = 'value ' + k;

                p.appendChild(desc);                  
                p.appendChild(s);                      
                div.appendChild(p);                       

            }
            s.textContent = pm5fields[k].printable(m.data[k]);
            */
        }
    }
};

/*
document.addEventListener('DOMContentLoaded', function(e) {
    m = new PM5(cbConnecting,
        cbConnected,
        cbDisconnected,
        cbMessage);

    document.querySelector('#connect').addEventListener('click', function() {
        if (!navigator.bluetooth) {
            alert('Web Bluetooth is not supported! You need a browser and ' +
                'platform that supports Web Bluetooth to use this application.');
        }

        if (m.connected()) {
            m.doDisconnect();
        } else {
            m.doConnect();
        }
    });

    document.querySelector('#toggle-instructions').addEventListener('click', function() {
        let e = document.querySelector('#instruction-text');
        let button_text = 'Show instructions';

        toggleClass(e, 'hidden');
        if (!e.classList.contains('hidden')) {
            button_text = 'Hide instructions';
        }

        document.querySelector('#toggle-instructions').innerText = button_text;
    });
});
*/
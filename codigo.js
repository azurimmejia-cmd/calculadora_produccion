// ============================================
// SISTEMA DE CONTROL DE PLANTA - VERSIÓN WEB
// ============================================

// Esta función se ejecuta cuando cambias el selector de producto
function actualizarFormulario() {
    const producto = document.getElementById('producto').value;
    const contenedor = document.getElementById('formulario-dinamico');
    const btnCalcular = document.getElementById('btnCalcular');
    const resultado = document.getElementById('resultado');
    
    // Limpiar resultado anterior
    resultado.innerHTML = '';
    resultado.classList.remove('visible');
    
    // Si no hay producto seleccionado, deshabilitar botón y limpiar
    if (!producto) {
        btnCalcular.disabled = true;
        contenedor.innerHTML = '';
        return;
    }
    
    // Habilitar botón
    btnCalcular.disabled = false;
    
    // Generar formulario según el producto seleccionado
    let html = '';
    
    switch (producto) {
        case 'cascaron':
            html = `
                <div class="grupo-campos">
                    <label>📏 Selecciona la medida:</label>
                    <select id="medidaCascaron">
                        <option value="1">Enteros (1 hoja = 1 pz | Paq: 25 | Tarima: 40 paq)</option>
                        <option value="2">Medios (1 hoja = 2 pz | Paq: 25 | Tarima: 80 paq)</option>
                        <option value="3">Cuartos (1 hoja = 4 pz | Paq: 50 | Tarima: 100 paq)</option>
                        <option value="4">Octavos (1 hoja = 8 pz | Paq: 50 | Tarima: 200 paq)</option>
                    </select>
                    
                    <label>📦 Cantidad de piezas solicitadas:</label>
                    <input type="number" id="solicitadasCascaron" placeholder="Ej: 1000" min="1" required>
                    
                    <label>📊 ¿Cómo deseas ingresar el stock?</label>
                    <select id="tipoIngresoCascaron" onchange="toggleStockCascaron()">
                        <option value="1">En piezas</option>
                        <option value="2">En paquetes</option>
                    </select>
                    
                    <div id="stockPiezasCascaron">
                        <label>📦 Cantidad en stock (piezas):</label>
                        <input type="number" id="stockPiezasCascaronInput" placeholder="Ej: 5000" min="0" required>
                    </div>
                    
                    <div id="stockPaquetesCascaron" style="display: none;">
                        <label>📦 Cantidad en stock (paquetes):</label>
                        <input type="number" id="stockPaquetesCascaronInput" placeholder="Ej: 200" step="0.1" min="0">
                    </div>
                </div>
            `;
            break;
            
        case 'opalina':
            html = `
                <div class="grupo-campos">
                    <label>📏 Selecciona la variante:</label>
                    <select id="varianteOpalina">
                        <option value="1">Carta (Cajas de 38 paquetes)</option>
                        <option value="2">Oficio (Cajas de 20 paquetes)</option>
                    </select>
                    
                    <label>📦 Cantidad de piezas solicitadas:</label>
                    <input type="number" id="solicitadasOpalina" placeholder="Ej: 5000" min="1" required>
                    
                    <label>📦 Cantidad en stock (piezas):</label>
                    <input type="number" id="stockOpalina" placeholder="Ej: 3000" min="0" required>
                </div>
            `;
            break;
            
        case 'cajas':
            html = `
                <div class="grupo-campos">
                    <label>📏 Selecciona el código del producto:</label>
                    <select id="codigoCajas">
                        <option value="1">CJK-OD-CT (SKU: 10011824)</option>
                        <option value="2">CJK-OD-OF (SKU: 10011891)</option>
                        <option value="3">CJK-OD-REG (SKU: 10011904)</option>
                        <option value="4">CJK-OFIX-TC (SKU: 10011921)</option>
                        <option value="5">CJK-OFIX-TO (SKU: 10011939)</option>
                        <option value="6">CJK-OFIX-TOBC (SKU: 10011947)</option>
                    </select>
                    
                    <label>📦 Cantidad solicitada en piezas:</label>
                    <input type="number" id="solicitadasCajas" placeholder="Ej: 500" min="1" required>
                    
                    <label>📦 Stock actual TERMINADO (en atados):</label>
                    <input type="number" id="stockTerminadoCajas" placeholder="Ej: 30" step="0.1" min="0" required>
                    <div class="info-ayuda">Cada atado contiene 25 piezas</div>
                    
                    <label>📦 Stock total de producto NO doblado (en piezas):</label>
                    <input type="number" id="stockNoDobladoCajas" placeholder="Ej: 200" min="0" required>
                </div>
            `;
            break;
    }
    
    contenedor.innerHTML = html;
}

// Función para mostrar/ocultar campos de stock en Cascarón
function toggleStockCascaron() {
    const tipo = document.getElementById('tipoIngresoCascaron').value;
    const divPiezas = document.getElementById('stockPiezasCascaron');
    const divPaquetes = document.getElementById('stockPaquetesCascaron');
    
    if (tipo === '1') {
        divPiezas.style.display = 'block';
        divPaquetes.style.display = 'none';
        document.getElementById('stockPaquetesCascaronInput').removeAttribute('required');
        document.getElementById('stockPiezasCascaronInput').setAttribute('required', 'required');
    } else {
        divPiezas.style.display = 'none';
        divPaquetes.style.display = 'block';
        document.getElementById('stockPiezasCascaronInput').removeAttribute('required');
        document.getElementById('stockPaquetesCascaronInput').setAttribute('required', 'required');
    }
}

// Esta función se ejecuta cuando haces clic en "Calcular"
function procesarCalculo() {
    const producto = document.getElementById('producto').value;
    const resultado = document.getElementById('resultado');
    
    if (!producto) {
        mostrarError(resultado, '⚠️ Por favor, selecciona un producto.');
        return;
    }
    
    try {
        let output = '';
        
        switch (producto) {
            case 'cascaron':
                output = calcularCascaron();
                break;
            case 'opalina':
                output = calcularOpalina();
                break;
            case 'cajas':
                output = calcularCajas();
                break;
            default:
                mostrarError(resultado, 'Producto no reconocido.');
                return;
        }
        
        resultado.innerHTML = output;
        resultado.classList.add('visible');
        
        // Hacer scroll al resultado
        resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        mostrarError(resultado, `❌ ${error.message}`);
    }
}

// ============================================
// FUNCIÓN CALCULAR CASCARÓN (CON FORMATO MEJORADO)
// ============================================

function calcularCascaron() {
    // Leer valores del formulario
    const opcion = document.getElementById('medidaCascaron').value;
    const solicitadas = parseFloat(document.getElementById('solicitadasCascaron').value);
    const tipoIngreso = document.getElementById('tipoIngresoCascaron').value;
    
    let stockPiezas;
    if (tipoIngreso === '1') {
        stockPiezas = parseFloat(document.getElementById('stockPiezasCascaronInput').value);
    } else {
        const paquetesStock = parseFloat(document.getElementById('stockPaquetesCascaronInput').value);
        // Necesitamos el pzPaquete para convertir, pero aún no lo tenemos
        // Lo calcularemos después de definir la configuración
        stockPiezas = null; // Temporal
    }
    
    // Configuración según medida
    let medidaNombre, divisor, pzPaquete, paqPorTarima;
    
    switch (opcion) {
        case "1": medidaNombre = "Enteros"; divisor = 1; pzPaquete = 25; paqPorTarima = 40; break;
        case "2": medidaNombre = "Medios"; divisor = 2; pzPaquete = 25; paqPorTarima = 80; break;
        case "3": medidaNombre = "Cuartos"; divisor = 4; pzPaquete = 50; paqPorTarima = 100; break;
        case "4": medidaNombre = "Octavos"; divisor = 8; pzPaquete = 50; paqPorTarima = 200; break;
        default: throw new Error('Opción de medida no válida.');
    }
    
    // Si el stock se ingresó en paquetes, convertirlo a piezas
    if (tipoIngreso === '2') {
        const paquetesStock = parseFloat(document.getElementById('stockPaquetesCascaronInput').value);
        if (isNaN(paquetesStock) || paquetesStock < 0) {
            throw new Error('El stock en paquetes debe ser un número válido.');
        }
        stockPiezas = paquetesStock * pzPaquete;
    }
    
    // Validaciones
    if (!solicitadas || solicitadas <= 0) {
        throw new Error('La cantidad solicitada debe ser mayor a 0.');
    }
    if (isNaN(stockPiezas) || stockPiezas < 0) {
        throw new Error('El stock debe ser un número válido.');
    }
    
    // Cálculos del pedido
    const paquetesTotalesPedido = solicitadas / pzPaquete;
    const hojasTotalesPedido = solicitadas / divisor;
    
    // Cálculo para tarimas base de 1000 piezas (hojas base)
    const tarimasCompletas = Math.floor(hojasTotalesPedido / 1000);
    const sobranteHojas = Math.floor(hojasTotalesPedido - (tarimasCompletas * 1000));
    
    // Generar reporte con formato mejorado
    let reporte = '';
    
    // Título principal
    reporte += `<div class="titulo-principal">📊 REPORTE DE PEDIDO (${medidaNombre.toUpperCase()})</div>`;
    reporte += `<hr class="linea-separadora">`;
    
    // Datos del pedido
    reporte += `<div class="dato"><strong>📦 Pedido total:</strong> <span class="numero-destacado">${solicitadas}</span> piezas</div>`;
    reporte += `<div class="dato"><strong>📄 Equivalente a:</strong> ${hojasTotalesPedido.toFixed(1)} hojas</div>`;
    reporte += `<div class="dato"><strong>📦 Equivalente a:</strong> ${paquetesTotalesPedido.toFixed(2)} paquetes (<span class="numero-destacado">${Math.floor(paquetesTotalesPedido)}</span> paquetes cerrados)</div>`;
    
    // Equivalente en tarimas
    let tarimaTexto = '';
    if (sobranteHojas > 0) {
        tarimaTexto = `${tarimasCompletas} tarimas de 1000 y una con <span class="numero-destacado">${sobranteHojas}</span> piezas/hojas.`;
    } else {
        tarimaTexto = `${tarimasCompletas} tarimas exactas de 1000.`;
    }
    reporte += `<div class="dato tarima-info"><strong>📋 Equivale en tarimas:</strong> ${tarimaTexto}</div>`;
    
    reporte += `<hr class="linea-separadora">`;
    
    // Estado del inventario
    reporte += `<div class="titulo-secundario">📊 ESTADO DEL INVENTARIO</div>`;
    reporte += `<div class="dato"><strong>📦 Solicitado:</strong> ${solicitadas} pz</div>`;
    reporte += `<div class="dato"><strong>📦 En Stock:</strong> ${Math.floor(stockPiezas)} pz (<span class="numero-destacado">${(stockPiezas / pzPaquete).toFixed(1)}</span> paquetes)</div>`;
    
    reporte += `<hr class="linea-separadora">`;
    
    // Evaluar disponibilidad
    if (stockPiezas >= solicitadas) {
        const sobrantePiezas = stockPiezas - solicitadas;
        const paquetesSobrantes = sobrantePiezas / pzPaquete;
        const vecesAbastece = stockPiezas / solicitadas;
        
        reporte += `<div class="estado-exito">✅ ESTADO: ¡PEDIDO LISTO!</div>`;
        reporte += `<div class="dato"><strong>✅ Stock suficiente</strong></div>`;
        reporte += `<div class="dato">📌 Sobran <span class="numero-destacado">${Math.floor(sobrantePiezas)}</span> piezas (${paquetesSobrantes.toFixed(2)} paquetes)</div>`;
        reporte += `<div class="dato">📌 El stock cubre este pedido <span class="numero-destacado">${vecesAbastece.toFixed(2)}</span> veces</div>`;
    } else {
        const faltantesPiezas = solicitadas - stockPiezas;
        const faltantesPaquetes = faltantesPiezas / pzPaquete;
        
        // Cálculo de tarimas para lo que falta
        const hojasFaltantes = faltantesPiezas / divisor;
        const tarimasFaltantes = Math.floor(hojasFaltantes / 1000);
        const sobranteHojasFaltantes = Math.floor(hojasFaltantes - (tarimasFaltantes * 1000));
        
        reporte += `<div class="estado-error">❌ ESTADO: PEDIDO NO LISTO</div>`;
        reporte += `<div class="dato"><strong>❌ Stock INSUFICIENTE</strong></div>`;
        reporte += `<div class="dato">📌 Faltan: <span class="numero-destacado">${Math.floor(faltantesPaquetes)}</span> paquetes que equivalen a <span class="numero-destacado">${Math.floor(faltantesPiezas)}</span> piezas.</div>`;
        
        // Equivalente en tarimas del faltante
        let tarimaFaltanteTexto = '';
        if (tarimasFaltantes > 0) {
            if (sobranteHojasFaltantes > 0) {
                tarimaFaltanteTexto = `${tarimasFaltantes} tarima(s) de 1000 y otra con <span class="numero-destacado">${sobranteHojasFaltantes}</span> piezas/hojas.`;
            } else {
                tarimaFaltanteTexto = `${tarimasFaltantes} tarima(s) exacta(s) de 1000.`;
            }
        } else {
            tarimaFaltanteTexto = `Menos de una tarima completa (<span class="numero-destacado">${sobranteHojasFaltantes}</span> piezas/hojas).`;
        }
        reporte += `<div class="dato tarima-info"><strong>📌 Equivalente del faltante en tarimas:</strong> ${tarimaFaltanteTexto}</div>`;
    }
    
    return reporte;
}

// ============================================
// FUNCIÓN CALCULAR OPALINA (CON FORMATO MEJORADO)
// ============================================

function calcularOpalina() {
    const opcion = document.getElementById('varianteOpalina').value;
    const solicitadas = parseFloat(document.getElementById('solicitadasOpalina').value);
    const stock = parseFloat(document.getElementById('stockOpalina').value);
    
    if (!solicitadas || solicitadas <= 0) {
        throw new Error('La cantidad solicitada debe ser mayor a 0.');
    }
    if (isNaN(stock) || stock < 0) {
        throw new Error('El stock debe ser un número válido.');
    }
    
    let paqPorCaja;
    switch (opcion) {
        case "1": paqPorCaja = 38; break;
        case "2": paqPorCaja = 20; break;
        default: throw new Error('Variante no válida.');
    }
    
    const piezasPorPaquete = 100;
    const cajasPorTarima = 35;
    const faltante = solicitadas - stock;
    
    let reporte = '';
    reporte += `<div class="titulo-principal">📊 REPORTE DE OPALINA</div>`;
    reporte += `<hr class="linea-separadora">`;
    reporte += `<div class="dato"><strong>📦 Pedido:</strong> ${solicitadas} piezas</div>`;
    reporte += `<div class="dato"><strong>📦 Stock actual:</strong> ${stock} piezas</div>`;
    reporte += `<hr class="linea-separadora">`;
    
    if (faltante > 0) {
        const paquetesFaltantes = faltante / piezasPorPaquete;
        const cajasFaltantes = paquetesFaltantes / paqPorCaja;
        const tarimas = cajasFaltantes / cajasPorTarima;
        
        reporte += `<div class="estado-error">❌ Faltan ${faltante} piezas</div>`;
        reporte += `<div class="dato"><strong>📌 Necesitas:</strong></div>`;
        reporte += `<div class="dato">   • <span class="numero-destacado">${paquetesFaltantes.toFixed(2)}</span> paquetes</div>`;
        reporte += `<div class="dato">   • <span class="numero-destacado">${cajasFaltantes.toFixed(2)}</span> cajas</div>`;
        reporte += `<div class="dato">   • <span class="numero-destacado">${tarimas.toFixed(2)}</span> tarimas</div>`;
    } else {
        const sobrante = stock - solicitadas;
        const paqSobrantes = sobrante / piezasPorPaquete;
        reporte += `<div class="estado-exito">✅ ¡Stock suficiente!</div>`;
        reporte += `<div class="dato">📌 Sobran <span class="numero-destacado">${sobrante}</span> piezas (${paqSobrantes.toFixed(2)} paquetes)</div>`;
    }
    return reporte;
}

// ============================================
// FUNCIÓN CALCULAR CAJAS (CON FORMATO MEJORADO)
// ============================================

function calcularCajas() {
    const opCodigo = document.getElementById('codigoCajas').value;
    const solicitadas = parseFloat(document.getElementById('solicitadasCajas').value);
    const atadosTerminados = parseFloat(document.getElementById('stockTerminadoCajas').value);
    const stockNoDobladoPiezas = parseFloat(document.getElementById('stockNoDobladoCajas').value);
    
    if (!solicitadas || solicitadas <= 0) {
        throw new Error('La cantidad solicitada debe ser mayor a 0.');
    }
    if (isNaN(atadosTerminados) || atadosTerminados < 0) {
        throw new Error('El stock terminado debe ser un número válido.');
    }
    if (isNaN(stockNoDobladoPiezas) || stockNoDobladoPiezas < 0) {
        throw new Error('El stock no doblado debe ser un número válido.');
    }
    
    let clave, sku;
    switch (opCodigo) {
        case "1": clave = "CJK-OD-CT"; sku = "10011824"; break;
        case "2": clave = "CJK-OD-OF"; sku = "10011891"; break;
        case "3": clave = "CJK-OD-REG"; sku = "10011904"; break;
        case "4": clave = "CJK-OFIX-TC"; sku = "10011921"; break;
        case "5": clave = "CJK-OFIX-TO"; sku = "10011939"; break;
        case "6": clave = "CJK-OFIX-TOBC"; sku = "10011947"; break;
        default: throw new Error('Código no válido.');
    }
    
    const stockTerminadoPiezas = atadosTerminados * 25;
    const stockTotalGlobal = stockTerminadoPiezas + stockNoDobladoPiezas;
    const atadosTotalesPedido = solicitadas / 25;
    const tarimasCompletasPedido = Math.floor(atadosTotalesPedido / 16);
    const atadosGranelPedido = Math.floor(atadosTotalesPedido - (tarimasCompletasPedido * 16));
    
    let reporte = '';
    reporte += `<div class="titulo-principal">📊 REPORTE GENERAL DE CAJAS</div>`;
    reporte += `<hr class="linea-separadora">`;
    reporte += `<div class="dato"><strong>📦 Código:</strong> ${clave} | SKU: ${sku}</div>`;
    reporte += `<div class="dato"><strong>📦 Pedido:</strong> ${solicitadas} piezas</div>`;
    reporte += `<div class="dato"><strong>📦 Equivale a:</strong> ${Math.floor(atadosTotalesPedido)} atados en total</div>`;
    reporte += `<div class="dato"><strong>📋 Desglose:</strong> ${tarimasCompletasPedido} tarimas completas y ${atadosGranelPedido} atados/paquetes sueltos.</div>`;
    reporte += `<hr class="linea-separadora">`;
    reporte += `<div class="dato"><strong>📦 Stock Terminado:</strong> ${atadosTerminados} atados (${Math.floor(stockTerminadoPiezas)} piezas)</div>`;
    reporte += `<div class="dato"><strong>📦 Stock No Doblado:</strong> ${stockNoDobladoPiezas} piezas</div>`;
    reporte += `<div class="dato"><strong>📦 Stock Total Disponible:</strong> ${Math.floor(stockTotalGlobal)} piezas</div>`;
    reporte += `<hr class="linea-separadora">`;
    
    if (stockTerminadoPiezas >= solicitadas) {
        const sobrantePiezas = stockTerminadoPiezas - solicitadas;
        const atadosSobrantes = sobrantePiezas / 25;
        const vecesQueAbastece = stockTerminadoPiezas / solicitadas;
        
        reporte += `<div class="estado-exito">✅ ESTADO: ¡PEDIDO LISTO!</div>`;
        reporte += `<div class="dato"><strong>✅ Producto terminado:</strong> SÍ</div>`;
        reporte += `<div class="dato"><strong>✅ Estado de Stock:</strong> SUFICIENTE (Todo listo en terminado)</div>`;
        if (sobrantePiezas > 0) {
            reporte += `<div class="dato">📌 ¡Sobra producto terminado! Sobran <span class="numero-destacado">${Math.floor(sobrantePiezas)}</span> piezas (${Math.floor(atadosSobrantes)} atados).</div>`;
            reporte += `<div class="dato">📌 Tu stock terminado abastece para cubrir este pedido <span class="numero-destacado">${vecesQueAbastece.toFixed(2)}</span> veces.</div>`;
        }
    } else {
        const piezasFaltantesTerminado = solicitadas - stockTerminadoPiezas;
        const atadosFaltantesTerminado = piezasFaltantesTerminado / 25;
        const tarimasCompletasFaltantes = Math.floor(atadosFaltantesTerminado / 16);
        const atadosGranelFaltantes = Math.floor(atadosFaltantesTerminado - (tarimasCompletasFaltantes * 16));
        
        reporte += `<div class="estado-error">❌ ESTADO: PEDIDO NO LISTO</div>`;
        reporte += `<div class="dato"><strong>❌ Producto terminado:</strong> NO</div>`;
        reporte += `<div class="dato">📌 Atados faltantes terminados: <span class="numero-destacado">${Math.floor(atadosFaltantesTerminado)}</span> atados (equivalente a <span class="numero-destacado">${Math.floor(piezasFaltantesTerminado)}</span> piezas)</div>`;
        reporte += `<div class="dato"><strong>📌 Estado de Stock:</strong> INSUFICIENTE en producto terminado</div>`;
        reporte += `<div class="dato">📌 A producir/procesar: ${tarimasCompletasFaltantes} tarimas completas y ${atadosGranelFaltantes} atados sueltos.</div>`;
        
        if (stockTotalGlobal >= solicitadas) {
            const sobranteGlobal = stockTotalGlobal - solicitadas;
            const atadosSobrantesGlobal = sobranteGlobal / 25;
            reporte += `<div class="nota-info">ℹ️ Nota: Tienes material suficiente sumando el no doblado. Sobrarían ${Math.floor(sobranteGlobal)} piezas (${Math.floor(atadosSobrantesGlobal)} atados).</div>`;
        } else {
            reporte += `<div class="nota-alerta">⚠️ ALERTA: Ni sumando el stock no doblado se alcanza a cubrir el pedido total.</div>`;
        }
    }
    return reporte;
}

function mostrarError(elemento, mensaje) {
    elemento.innerHTML = `<div style="font-size:18px; padding:10px;">❌ ${mensaje}</div>`;
    elemento.classList.add('visible');
}

// Inicializar el formulario al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFormulario();
});
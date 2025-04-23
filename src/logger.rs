use std::panic;
use std::sync::Once;
// use log::info;

pub(crate) struct Logger {}

static INIT_LOGGER: Once = Once::new();

impl Logger {
    pub(crate) fn prepare() {
        panic::set_hook(Box::new(console_error_panic_hook::hook));
        INIT_LOGGER.call_once(|| {
            console_log::init_with_level(log::Level::Debug).expect("error initializing log");
        });
    }
}

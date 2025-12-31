package ${com_net_org_dk}.${your_name};

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.fabricmc.api.ModInitializer;

/**
 * Main class for the ${mod_name} mod.
 */
public class ${mod_name} implements ModInitializer {
	public static final String MOD_ID = "${mod_id}";
	public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

	private static ${mod_name} instance;
	public static ${mod_name} getInstance() {
		return instance;
	}

		LOGGER.info("${mod_name} initialized successfully!");
	}
}

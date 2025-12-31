package ${com_net_org_dk}.${your_name}.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.fabricmc.api.ClientModInitializer;

/**
 * Client-side initializer for the ${mod_name} mod.
 */
public class ${mod_name}Client implements ClientModInitializer {
	public static final Logger LOGGER = LoggerFactory.getLogger(${mod_name}.MOD_ID + "-client");

	@Override
	public void onInitializeClient() {
		// Client-side initialization logic can be added here

		LOGGER.info("${mod_name} client initialized successfully!");
	}
}
